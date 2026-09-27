export enum PeerDeviceType {
  mobile = "MOBILE",
  desktop = "DESKTOP",
  web = "WEB",
  headless = "HEADLESS",
  server = "SERVER",
}

export type ClientInfoWithoutId = {
  alias: string;
  version: string;
  deviceModel?: string;
  deviceType?: PeerDeviceType;
  token: string;
};

export type ClientInfo = ClientInfoWithoutId & { id: string };

// WebSocket server messages
export type WsServerMessage =
  | HelloMessage
  | JoinMessage
  | LeftMessage
  | UpdateMessage
  | OfferMessage
  | AnswerMessage
  | ErrorMessage;

export type HelloMessage = {
  type: "HELLO";
  client: ClientInfo;
  peers: ClientInfo[];
};

export type JoinMessage = {
  type: "JOIN";
  peer: ClientInfo;
};

export type UpdateMessage = {
  type: "UPDATE";
  peer: ClientInfo;
};

export type LeftMessage = {
  type: "LEFT";
  peerId: string;
};

export type WsServerSdpMessage = {
  peer: ClientInfo;
  sessionId: string;
  sdp: string;
};

export type OfferMessage = WsServerSdpMessage & { type: "OFFER" };

export type AnswerMessage = WsServerSdpMessage & { type: "ANSWER" };

export type ErrorMessage = {
  type: "ERROR";
  code: number;
};

// WebSocket client messages
export type WsClientMessage = WsClientUpdateMessage | WsClientSdpMessage;

export type WsClientUpdateMessage = {
  type: "UPDATE";
  info: ClientInfoWithoutId;
};

export type WsClientSdpMessage = {
  type: "OFFER" | "ANSWER";
  sessionId: string;
  target: string;
  sdp: string;
};

// WebRTC transfer types
export type PinConfig = {
  pin: string;
  maxTries: number;
};

export type FileProgress = {
  id: string;
  curr: number;
  success?: boolean;
  error?: string;
};

export type FileDto = {
  id: string;
  fileName: string;
  size: number;
  fileType: string;
  sha256?: string;
  preview?: string;
  metadata?: FileMetadata;
};

export type FileMetadata = {
  modified?: string;
  accessed?: string;
};

// Session state
export enum SessionState {
  idle = "idle",
  sending = "sending",
  receiving = "receiving",
}

export type FileState = {
  id: string;
  name: string;
  curr: number;
  total: number;
  state: "pending" | "skipped" | "sending" | "finished" | "error";
  error?: string;
};
