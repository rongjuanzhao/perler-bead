import { encodeStringToBase64 } from "@/src/utils/transfer/base64";
import type {
  ClientInfoWithoutId,
  ClientInfo,
  WsServerMessage,
  WsClientMessage,
  WsClientUpdateMessage,
  AnswerMessage,
  OfferMessage,
  PeerDeviceType,
} from "./types";

type OnAnswer = {
  sessionId: string;
  callback: (message: AnswerMessage) => void;
};

export class SignalingConnection {
  private _socket: WebSocket;
  private _onAnswer: OnAnswer | null = null;

  private constructor(socket: WebSocket) {
    this._socket = socket;
  }

  public static async connect({
    url,
    info,
    onMessage,
    generateNewInfo,
    onClose,
  }: {
    url: string;
    info: ClientInfoWithoutId;
    onMessage: (message: WsServerMessage) => void;
    generateNewInfo: () => Promise<ClientInfoWithoutId>;
    onClose: () => void;
  }): Promise<SignalingConnection> {
    console.log(`Connecting to ${url}`);

    const encodedInfo = encodeStringToBase64(JSON.stringify(info));
    const socket = await new Promise<WebSocket>((resolve, reject) => {
      const ws = new WebSocket(`${url}?d=${encodedInfo}`);
      ws.onopen = () => resolve(ws);
      ws.onerror = (err) => reject(err);
    });

    // ping every 120 seconds to keep the connection alive
    const pingInterval = setInterval(() => {
      socket.send("");
    }, 120 * 1000);

    // every half hour, generate a new fingerprint
    const fingerprintInterval = setInterval(async () => {
      const info = await generateNewInfo();
      socket.send(
        JSON.stringify({
          type: "UPDATE",
          info: info,
        } as WsClientUpdateMessage),
      );
    }, 30 * 60 * 1000);

    socket.onclose = () => {
      console.log("Signaling connection closed");
      clearInterval(pingInterval);
      clearInterval(fingerprintInterval);
      onClose();
    };

    console.log("Signaling connection established");

    const instance = new SignalingConnection(socket);

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data) as WsServerMessage;
      console.log(`WS in: ${event.data}`);
      if (
        message.type === "ANSWER" &&
        instance._onAnswer &&
        message.sessionId === instance._onAnswer.sessionId
      ) {
        instance._onAnswer.callback(message);
        instance._onAnswer = null;
      }
      onMessage(message);
    };

    return instance;
  }

  public send(message: WsClientMessage) {
    console.log(`WS out: ${JSON.stringify(message)}`);
    this._socket.send(JSON.stringify(message));
  }

  public async waitForAnswer(sessionId: string): Promise<AnswerMessage> {
    return await new Promise<AnswerMessage>((resolve) => {
      this._onAnswer = {
        sessionId,
        callback: (message) => resolve(message),
      };
    });
  }

  public async waitUntilClose(): Promise<void> {
    return new Promise((resolve) => {
      this._socket.addEventListener("close", () => {
        resolve();
      });
    });
  }
}
