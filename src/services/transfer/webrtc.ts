import { SignalingConnection } from "./signaling";
import type { WsServerSdpMessage } from "./types";
import { decodeBase64, encodeBase64 } from "@/src/utils/transfer/base64";
import { StreamController } from "@/src/utils/transfer/streamController";
import pako from "pako";
import { saveFileFromBytes } from "@/src/utils/transfer/fileSaver";
import { generateNonce, validateNonce } from "@/src/utils/transfer/nonce";
import { generateClientTokenFromNonce } from "./crypto";
import type { PinConfig, FileProgress, FileDto } from "./types";

export const protocolVersion = "2.3";

export const defaultStun = ["stun:stun.l.google.com:19302"];

// ---- Internal RTC message types ----

type RTCNonceMessage = { nonce: string };
type RTCTokenRequest = { token: string };
type RTCTokenResponse =
  | { status: "OK"; token: string }
  | { status: "PIN_REQUIRED"; token: string }
  | { status: "INVALID_SIGNATURE" };

type RTCPinMessage = { pin: string };
type RTCPinReceivingResponse = { status: "OK" | "PIN_REQUIRED" | "TOO_MANY_ATTEMPTS" };

type RTCPinSendingResponse =
  | { status: "OK"; files: FileDto[] }
  | { status: "PIN_REQUIRED" }
  | { status: "TOO_MANY_ATTEMPTS" };

type RTCFileListResponse =
  | { status: "OK"; files: Record<string, string> }
  | { status: "PAIR"; publicKey: string }
  | { status: "DECLINED" }
  | { status: "INVALID_SIGNATURE" };

type RTCPairResponse =
  | { status: "OK"; publicKey: string }
  | { status: "PAIR_DECLINED" }
  | { status: "INVALID_SIGNATURE" };

type RTCSendFileHeaderRequest = { id: string; token: string };
type RTCSendFileResponse = { id: string; success: boolean; error?: string };

// ---- Constants ----

const CHUNK_SIZE = 16 * 1024; // 16 KiB
const MAX_BUFFERED_AMOUNT = 1024 * 1024; // 1 MiB

// ---- Send files ----

export async function sendFiles({
  signaling,
  stunServers,
  fileDtoList,
  fileMap,
  targetId,
  signingKey,
  pin,
  onPin,
  onFilesSkip,
  onFileProgress,
}: {
  signaling: SignalingConnection;
  stunServers: string[];
  fileDtoList: FileDto[];
  fileMap: Record<string, File>;
  targetId: string;
  signingKey: CryptoKeyPair;
  pin?: PinConfig;
  onPin: () => Promise<string | null>;
  onFilesSkip: (fileIds: string[]) => void;
  onFileProgress: (progress: FileProgress) => void;
}) {
  console.log("Sending to target:", targetId);

  const peerConnection = await createPeerConnection(stunServers);

  const dataChannel = peerConnection.createDataChannel("data");
  dataChannel.binaryType = "arraybuffer";
  const dataChannelStream = createStreamController(dataChannel);
  const dataChannelOpened = new Promise<void>((resolve) => {
    dataChannel.onopen = () => resolve();
  });

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  await waitICEGathering(peerConnection);
  const localSdp = peerConnection.localDescription!.sdp;

  const sessionId = Math.random().toString(36).substring(2, 15);

  signaling.send({
    type: "OFFER",
    sessionId,
    target: targetId,
    sdp: encodeSdp(localSdp),
  });

  const answer = await signaling.waitForAnswer(sessionId);
  const answerSdp = decodeSdp(answer.sdp);

  await peerConnection.setRemoteDescription({ type: "answer", sdp: answerSdp });
  await dataChannelOpened;

  // Nonce exchange
  const localNonce = await generateNonce();
  dataChannel.send(JSON.stringify({ nonce: encodeBase64(localNonce) } as RTCNonceMessage));
  const remoteNonce = await receiveNonce(dataChannelStream);
  const nonce = new Uint8Array(localNonce.length + remoteNonce.length);
  nonce.set(localNonce);
  nonce.set(remoteNonce, localNonce.length);

  // Token exchange
  const localToken = await generateClientTokenFromNonce(signingKey, nonce);
  dataChannel.send(JSON.stringify({ token: localToken } as RTCTokenRequest));

  const tokenResponseRaw = await dataChannelStream.readNext();
  if (typeof tokenResponseRaw !== "string") throw new Error("Expected string");
  const tokenResponse = JSON.parse(tokenResponseRaw) as RTCTokenResponse;
  if (tokenResponse.status === "INVALID_SIGNATURE") {
    console.error("Invalid signature");
    return;
  }

  if (tokenResponse.status === "PIN_REQUIRED") {
    await handlePin<number>(
      dataChannelStream, dataChannel, onPin, false,
      (response) => {
        const parsed = JSON.parse(response) as RTCPinSendingResponse;
        if (parsed.status === "PIN_REQUIRED" || parsed.status === "TOO_MANY_ATTEMPTS") {
          return parsed.status;
        }
        return 1;
      },
    );
  }

  // Sender-side PIN check
  if (pin) {
    let remotePin = "";
    let pinTry = 0;

    while (true) {
      if (remotePin === pin.pin) break;
      if (pinTry >= pin.maxTries) {
        sendStringInChunks(dataChannel, JSON.stringify({ status: "TOO_MANY_ATTEMPTS" } as RTCPinSendingResponse));
        sendDelimiter(dataChannel);
        await waitBufferEmpty(dataChannel);
        return;
      }

      sendStringInChunks(dataChannel, JSON.stringify({ status: "PIN_REQUIRED" } as RTCPinSendingResponse));
      sendDelimiter(dataChannel);

      const remotePinRaw = await dataChannelStream.readNext();
      if (typeof remotePinRaw !== "string") throw new Error("Expected string");
      remotePin = (JSON.parse(remotePinRaw) as RTCPinMessage).pin;
      pinTry++;
    }
  }

  // Send file list
  sendStringInChunks(dataChannel, JSON.stringify({ status: "OK", files: fileDtoList } as RTCPinSendingResponse));
  sendDelimiter(dataChannel);

  let fileListResponseRaw = await receiveStringFromChunks(dataChannelStream);
  let fileListResponse = JSON.parse(fileListResponseRaw) as RTCFileListResponse;
  let fileTokens: Record<string, string>;

  if (fileListResponse.status === "OK") {
    fileTokens = fileListResponse.files;
  } else if (fileListResponse.status === "PAIR") {
    dataChannel.send(JSON.stringify({ status: "PAIR_DECLINED" } as RTCPairResponse));
    fileListResponseRaw = await receiveStringFromChunks(dataChannelStream);
    fileListResponse = JSON.parse(fileListResponseRaw) as RTCFileListResponse;
    if (fileListResponse.status === "OK") {
      fileTokens = fileListResponse.files;
    } else {
      return;
    }
  } else {
    return;
  }

  const skippedFiles: string[] = [];
  fileDtoList = fileDtoList.filter((file) => {
    const hasToken = fileTokens[file.id];
    if (!hasToken) skippedFiles.push(file.id);
    return hasToken;
  });

  if (skippedFiles.length > 0) onFilesSkip(skippedFiles);

  const startTime = Date.now();

  const firstFileDto = fileDtoList[0];
  dataChannel.send(JSON.stringify({ id: firstFileDto.id, token: fileTokens[firstFileDto.id] } as RTCSendFileHeaderRequest));

  for (let i = 0; i < fileDtoList.length; i++) {
    const fileDto = fileDtoList[i];
    const file = fileMap[fileDto.id];
    const fileSize = file.size;

    await sendFileInChunks(dataChannel, file, (bytes) => {
      onFileProgress({ id: fileDto.id, curr: bytes });
    });

    if (i + 1 < fileDtoList.length) {
      const nextFileDto = fileDtoList[i + 1];
      dataChannel.send(JSON.stringify({ id: nextFileDto.id, token: fileTokens[nextFileDto.id] } as RTCSendFileHeaderRequest));
    } else {
      sendDelimiter(dataChannel);
    }

    const fileStatus = await dataChannelStream.readNext();
    if (typeof fileStatus !== "string") throw new Error("Expected string");
    const response = JSON.parse(fileStatus) as RTCSendFileResponse;
    onFileProgress({ id: fileDto.id, curr: fileSize, success: response.success, error: response.error });
  }

  const sumSize = fileDtoList.reduce((sum, file) => sum + file.size, 0);
  console.log(`Finished in ${Date.now() - startTime} ms. Speed: ${(sumSize * 1000) / (Date.now() - startTime) / (1024 * 1024)} MB/s`);

  dataChannel.close();
  peerConnection.close();
}

// ---- Receive files ----

export async function receiveFiles({
  signaling,
  stunServers,
  offer,
  signingKey,
  pin,
  onPin,
  selectFiles,
  onFileProgress,
}: {
  signaling: SignalingConnection;
  stunServers: string[];
  offer: WsServerSdpMessage;
  signingKey: CryptoKeyPair;
  pin?: PinConfig;
  onPin: () => Promise<string | null>;
  selectFiles: (files: FileDto[]) => Promise<string[]>;
  onFileProgress: (progress: FileProgress) => void;
}) {
  const peerConnection = await createPeerConnection(stunServers);

  const dataChannelPromise = new Promise<RTCDataChannel>((resolve) => {
    peerConnection.ondatachannel = (event) => resolve(event.channel);
  });

  await peerConnection.setRemoteDescription({ type: "offer", sdp: decodeSdp(offer.sdp) });

  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  await waitICEGathering(peerConnection);
  const localSdp = peerConnection.localDescription!.sdp;

  signaling.send({ type: "ANSWER", sessionId: offer.sessionId, target: offer.peer.id, sdp: encodeSdp(localSdp) });

  const dataChannel = await dataChannelPromise;
  dataChannel.binaryType = "arraybuffer";
  const dataChannelStream = createStreamController(dataChannel);

  await new Promise<void>((resolve) => { dataChannel.onopen = () => resolve(); });

  // Nonce exchange
  const remoteNonce = await receiveNonce(dataChannelStream);
  const localNonce = await generateNonce();
  dataChannel.send(JSON.stringify({ nonce: encodeBase64(localNonce) } as RTCNonceMessage));
  const nonce = new Uint8Array(localNonce.length + remoteNonce.length);
  nonce.set(remoteNonce);
  nonce.set(localNonce, remoteNonce.length);

  // Token exchange
  const remoteTokenRaw = await dataChannelStream.readNext();
  if (typeof remoteTokenRaw !== "string") throw new Error("Expected string");
  const remoteToken = JSON.parse(remoteTokenRaw) as RTCTokenRequest;

  const localToken = await generateClientTokenFromNonce(signingKey, nonce);

  if (pin) {
    let remotePin = "";
    let pinTry = 0;

    dataChannel.send(JSON.stringify({ status: "PIN_REQUIRED", token: localToken } as RTCTokenResponse));

    while (true) {
      if (remotePin === pin.pin) break;
      if (pinTry >= pin.maxTries) {
        dataChannel.send(JSON.stringify({ status: "TOO_MANY_ATTEMPTS" } as RTCPinReceivingResponse));
        await waitBufferEmpty(dataChannel);
        return;
      }
      if (pinTry !== 0) {
        dataChannel.send(JSON.stringify({ status: "PIN_REQUIRED" } as RTCPinReceivingResponse));
      }
      const remotePinRaw = await dataChannelStream.readNext();
      if (typeof remotePinRaw !== "string") throw new Error("Expected string");
      remotePin = (JSON.parse(remotePinRaw) as RTCPinMessage).pin;
      pinTry++;
    }

    dataChannel.send(JSON.stringify({ status: "OK" } as RTCPinReceivingResponse));
  } else {
    dataChannel.send(JSON.stringify({ status: "OK", token: localToken } as RTCTokenResponse));
  }

  // Receive file list
  let pinSendingResponseRaw = await receiveStringFromChunks(dataChannelStream);
  let pinSendingResponse = JSON.parse(pinSendingResponseRaw) as RTCPinSendingResponse;
  let fileList: FileDto[];

  switch (pinSendingResponse.status) {
    case "OK":
      fileList = pinSendingResponse.files;
      break;
    case "TOO_MANY_ATTEMPTS":
      console.error("Too many attempts");
      return;
    case "PIN_REQUIRED":
      fileList = await handlePin<FileDto[]>(
        dataChannelStream, dataChannel, onPin, true,
        (response) => {
          const parsed = JSON.parse(response) as RTCPinSendingResponse;
          if (parsed.status === "PIN_REQUIRED" || parsed.status === "TOO_MANY_ATTEMPTS") return parsed.status;
          return parsed.files;
        },
      );
      break;
  }

  const selectedFiles = await selectFiles(fileList!);

  const selectedFilesMap: Record<string, FileDto> = {};
  const selectedFilesTokens: Record<string, string> = {};
  for (const file of fileList!) {
    if (selectedFiles.includes(file.id)) {
      selectedFilesMap[file.id] = file;
      selectedFilesTokens[file.id] = Math.random().toString();
    }
  }

  sendStringInChunks(dataChannel, JSON.stringify({ status: "OK", files: selectedFilesTokens } as RTCFileListResponse));
  sendDelimiter(dataChannel);

  // Receive file data
  const dataChannelIterator = dataChannelStream.createAsyncIterator();
  let fileState: { id: string; chunks: ArrayBuffer[]; curr: number } | null = null;

  for await (const chunk of dataChannelIterator.asyncIterator) {
    if (typeof chunk === "string") {
      if (fileState) {
        saveFileFromBytes(new Blob(fileState.chunks), selectedFilesMap[fileState.id].fileName);
        onFileProgress({ id: fileState.id, curr: fileState.curr, success: true });
        dataChannel.send(JSON.stringify({ id: fileState.id, success: true } as RTCSendFileResponse));

        if (chunk.length <= 1) {
          fileState = null;
          await waitBufferEmpty(dataChannel);
          break;
        }
      }

      const header = JSON.parse(chunk) as RTCSendFileHeaderRequest;
      fileState = { id: header.id, chunks: [], curr: 0 };
    } else {
      if (!fileState) throw new Error("Expected file state");
      fileState.chunks.push(chunk);
      fileState.curr += chunk.byteLength;
      onFileProgress({ id: fileState.id, curr: fileState.curr });
    }
  }
  dataChannelIterator.releaseLock();

  dataChannel.close();
  peerConnection.close();
}

// ---- Helpers ----

async function createPeerConnection(stunServers: string[]): Promise<RTCPeerConnection> {
  const peerConnection = new RTCPeerConnection({
    iceServers: stunServers.length === 0 ? undefined : [{ urls: stunServers }],
  });
  peerConnection.onicecandidateerror = (event) => console.error("ICE candidate error:", event);
  peerConnection.oniceconnectionstatechange = () => {
    console.log("ICE connection state:", peerConnection.iceConnectionState);
  };
  return peerConnection;
}

function createStreamController(dataChannel: RTCDataChannel) {
  const dataChannelStream = new StreamController<string | ArrayBuffer>();
  dataChannel.onmessage = (event) => dataChannelStream.add(event.data);
  return dataChannelStream;
}

function encodeSdp(s: string): string {
  const data = new TextEncoder().encode(s);
  const compressed = pako.deflate(data);
  return encodeBase64(compressed);
}

function decodeSdp(s: string): string {
  const compressed = decodeBase64(s);
  const decompressed = pako.inflate(compressed);
  if (!decompressed) throw new Error("Decompression failed.");
  return new TextDecoder().decode(decompressed);
}

async function receiveNonce(dataChannelStream: StreamController<string | ArrayBuffer>): Promise<Uint8Array> {
  const remoteNonce = await dataChannelStream.readNext();
  if (typeof remoteNonce !== "string") throw new Error("Expected string");
  const nonceMsg = JSON.parse(remoteNonce) as RTCNonceMessage;
  const decodedNonce = decodeBase64(nonceMsg.nonce);
  if (!validateNonce(decodedNonce)) throw new Error("Invalid remote nonce");
  return decodedNonce;
}

async function handlePin<T>(
  dataChannelStream: StreamController<string | ArrayBuffer>,
  dataChannel: RTCDataChannel,
  onPin: () => Promise<string | null>,
  receiveInChunks: boolean,
  parseResponse: (response: string) => T | "PIN_REQUIRED" | "TOO_MANY_ATTEMPTS",
): Promise<T> {
  while (true) {
    const pin = await onPin();
    if (!pin) {
      dataChannel.close();
      throw new Error("PIN required");
    }

    dataChannel.send(JSON.stringify({ pin } as RTCPinMessage));

    let response: string;
    if (receiveInChunks) {
      response = await receiveStringFromChunks(dataChannelStream);
    } else {
      const tmp = await dataChannelStream.readNext();
      if (typeof tmp !== "string") throw new Error("Expected string");
      response = tmp;
    }

    const parsedResponse = parseResponse(response);
    if (parsedResponse && typeof parsedResponse !== "string") return parsedResponse as T;

    switch (parsedResponse) {
      case "PIN_REQUIRED": break;
      case "TOO_MANY_ATTEMPTS": throw new Error("Too many attempts");
    }
  }
}

async function receiveStringFromChunks(dataChannelStream: StreamController<string | ArrayBuffer>): Promise<string> {
  const iterator = dataChannelStream.createAsyncIterator();
  const chunks: ArrayBuffer[] = [];
  for await (const chunk of iterator.asyncIterator) {
    if (typeof chunk === "string") break;
    chunks.push(chunk);
  }
  iterator.releaseLock();
  return arrayBufferToString(chunks);
}

function sendDelimiter(dataChannel: RTCDataChannel) {
  dataChannel.send("0");
}

function sendStringInChunks(dataChannel: RTCDataChannel, str: string) {
  const utf8Binary = new TextEncoder().encode(str);
  for (let i = 0; i < utf8Binary.length; i += CHUNK_SIZE) {
    dataChannel.send(utf8Binary.slice(i, i + CHUNK_SIZE));
  }
}

async function sendFileInChunks(dataChannel: RTCDataChannel, file: File, onProgress: (bytes: number) => void) {
  const reader = file.stream().getReader();
  let buffer = new Uint8Array(0);
  let bytesSent = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      if (buffer.length > 0) dataChannel.send(buffer);
      break;
    }

    const newBuffer = new Uint8Array(buffer.length + value.length);
    newBuffer.set(buffer);
    newBuffer.set(value, buffer.length);
    buffer = newBuffer;

    while (buffer.length >= CHUNK_SIZE) {
      while (dataChannel.bufferedAmount > MAX_BUFFERED_AMOUNT) {
        await new Promise((resolve) => setTimeout(resolve, 50));
      }
      const chunkToSend = buffer.slice(0, CHUNK_SIZE);
      dataChannel.send(chunkToSend);
      bytesSent += chunkToSend.length;
      onProgress(bytesSent);
      buffer = buffer.slice(CHUNK_SIZE);
    }
  }
}

function arrayBufferToString(arrayBuffers: ArrayBuffer[]): string {
  const totalLength = arrayBuffers.reduce((sum, buffer) => sum + buffer.byteLength, 0);
  const combinedArray = new Uint8Array(totalLength);
  let offset = 0;
  arrayBuffers.forEach((buffer) => {
    combinedArray.set(new Uint8Array(buffer), offset);
    offset += buffer.byteLength;
  });
  return new TextDecoder().decode(combinedArray);
}

async function waitBufferEmpty(dataChannel: RTCDataChannel) {
  while (dataChannel.bufferedAmount > 0) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
}

async function waitICEGathering(localConnection: RTCPeerConnection) {
  if (localConnection.iceGatheringState === "complete") return;
  await new Promise<void>((resolve) => {
    localConnection.onicegatheringstatechange = () => {
      if (localConnection.iceGatheringState === "complete") resolve();
    };
  });
}
