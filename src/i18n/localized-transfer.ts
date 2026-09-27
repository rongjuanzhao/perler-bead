export type LanTransferMessages = {
  encrypted: string;
  peerToPeer: string;
  sendStepTitle: string;
  sending: string;
  receiving: string;
  sendFiles: string;
  selectFilesAndDevice: string;
  selectDeviceToSend: string;
  waitingForConnection: string;
  linkCopied: string;
  linkCopyFailed: string;
  copyLinkHelp: string;
  yourDevice: string;
  browserNotSupportedTitle: string;
  browserNotSupportedDescription: string;
  changeName: string;
  online: string;
  connecting: string;
  selectFiles: string;
  dropFiles: string;
  clickToBrowse: string;
  fileSelectedSingular: string;
  fileSelectedPlural: string;
  clearAll: string;
  selectDevice: string;
  connectingToServer: string;
  noDevicesFound: string;
  openOnAnotherDevice: string;
  unknownDevice: string;
  sendingFiles: string;
  receivingFiles: string;
  totalProgress: string;
};

export const defaultLanTransferMessages: LanTransferMessages = {
  encrypted: "End-to-end encrypted",
  peerToPeer: "Peer-to-peer, no server",
  sendStepTitle: "Send",
  sending: "Sending...",
  receiving: "Receiving...",
  sendFiles: "Send Files",
  selectFilesAndDevice: "Select files and a device to start sending",
  selectDeviceToSend: "Select a device to send to",
  waitingForConnection: "Waiting for connection...",
  linkCopied: "Link copied to clipboard",
  linkCopyFailed: "Failed to copy link",
  copyLinkHelp: "Send this link to another device to start transferring",
  yourDevice: "Your Device",
  browserNotSupportedTitle: "Browser Not Supported",
  browserNotSupportedDescription:
    "Your browser does not support WebRTC. Please use a modern browser like Chrome, Firefox, or Edge.",
  changeName: "Change name",
  online: "Online",
  connecting: "Connecting",
  selectFiles: "Select Files",
  dropFiles: "Drop files here or",
  clickToBrowse: "click to browse",
  fileSelectedSingular: "file selected",
  fileSelectedPlural: "files selected",
  clearAll: "Clear all",
  selectDevice: "Select Device",
  connectingToServer: "Connecting to signaling server...",
  noDevicesFound: "No devices found",
  openOnAnotherDevice: "Open this page on another device to start transferring files.",
  unknownDevice: "Unknown",
  sendingFiles: "Sending files...",
  receivingFiles: "Receiving files...",
  totalProgress: "Total Progress",
};
