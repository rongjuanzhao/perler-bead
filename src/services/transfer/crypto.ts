import { decodeBase64, encodeBase64 } from "@/src/utils/transfer/base64";

type CryptoParams = {
  identifier: string;
  generate: AlgorithmIdentifier;
  import: AlgorithmIdentifier;
  sign: AlgorithmIdentifier;
};

const cryptoParams = {
  ed25519: {
    identifier: "ed25519",
    generate: { name: "Ed25519" },
    import: { name: "Ed25519" },
    sign: { name: "Ed25519" },
  },
  rsaPss: {
    identifier: "rsa-pss",
    generate: {
      name: "RSA-PSS",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    } as AlgorithmIdentifier,
    import: {
      name: "RSA-PSS",
      hash: "SHA-256",
    } as AlgorithmIdentifier,
    sign: {
      name: "RSA-PSS",
      saltLength: 32,
    } as AlgorithmIdentifier,
  },
};

let selectedParams: CryptoParams = cryptoParams.rsaPss;

export function isWebCryptoSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    window.crypto !== undefined &&
    window.crypto.subtle !== undefined &&
    "generateKey" in window.crypto.subtle
  );
}

export async function upgradeToEd25519IfSupported(): Promise<void> {
  try {
    await window.crypto.subtle.generateKey(
      cryptoParams.ed25519.generate,
      true,
      ["sign", "verify"],
    );
    selectedParams = cryptoParams.ed25519;
    console.log("Switched to Ed25519 for cryptographic operations.");
  } catch (e) {
    console.warn("Ed25519 not supported.");
  }
}

export async function generateKeyPair(): Promise<CryptoKeyPair> {
  return (await window.crypto.subtle.generateKey(
    selectedParams.generate,
    true,
    ["sign", "verify"],
  )) as CryptoKeyPair;
}

export async function cryptoKeyToPem(cryptoKey: CryptoKey): Promise<string> {
  const exported = await window.crypto.subtle.exportKey("spki", cryptoKey);
  const exportedAsBase64 = btoa(
    String.fromCharCode.apply(null, Array.from(new Uint8Array(exported))),
  );

  const pemHeader = "-----BEGIN PUBLIC KEY-----\n";
  const pemFooter = "\n-----END PUBLIC KEY-----";
  const pemBody = exportedAsBase64.match(/.{1,64}/g)!.join("\n");

  return pemHeader + pemBody + pemFooter;
}

export async function publicKeyFromDer(der: Uint8Array): Promise<CryptoKey> {
  return await window.crypto.subtle.importKey(
    "spki",
    der as BufferSource,
    selectedParams.import,
    true,
    ["verify"],
  );
}

export async function publicKeyFromPem(pem: string): Promise<CryptoKey> {
  const pemBody = pem
    .split("\n")
    .filter((line) => !line.includes("-----"))
    .join("");

  const der = new Uint8Array(
    atob(pemBody)
      .split("")
      .map((c) => c.charCodeAt(0)),
  );

  return publicKeyFromDer(der);
}

export async function generateClientTokenFromCurrentTimestamp(
  key: CryptoKeyPair,
): Promise<string> {
  const salt = unixTimestampU64();
  return await generateClientTokenFromNonce(key, salt);
}

export async function generateClientTokenFromNonce(
  key: CryptoKeyPair,
  nonce: Uint8Array,
): Promise<string> {
  const publicKeyDER = new Uint8Array(
    await window.crypto.subtle.exportKey("spki", key.publicKey),
  );
  const hashInput = concatBytes(publicKeyDER, nonce);
  const digest = await window.crypto.subtle.digest("SHA-256", hashInput);
  const signature = await window.crypto.subtle.sign(
    selectedParams.sign,
    key.privateKey,
    digest,
  );

  const hashMethod = "sha256";
  const hashBase64 = encodeBase64(new Uint8Array(digest));
  const saltBase64 = encodeBase64(nonce);
  const signMethod = selectedParams.identifier;
  const signatureBase64 = encodeBase64(new Uint8Array(signature));

  return [hashMethod, hashBase64, saltBase64, signMethod, signatureBase64].join(
    ".",
  );
}

export async function verifyToken(
  publicKey: CryptoKey,
  token: string,
): Promise<boolean> {
  const parts = token.split(".");
  if (parts.length !== 5) {
    return false;
  }

  const [hashMethod, hashB64, saltB64, signMethod, signB64] = parts;

  if (hashMethod !== "sha256") {
    return false;
  }

  if (signMethod !== selectedParams.identifier) {
    return false;
  }

  const saltBuffer = decodeBase64(saltB64);
  if (saltBuffer.byteLength !== 8) {
    return false;
  }
  const saltSeconds = Number(decodeU64(saltBuffer));

  const nowInSeconds = Math.floor(Date.now() / 1000);
  if (nowInSeconds - saltSeconds > 60 * 60) {
    return false;
  }

  const publicKeyDER = await crypto.subtle.exportKey("spki", publicKey);
  const hashInput = concatBytes(new Uint8Array(publicKeyDER), saltBuffer);

  const digest = await crypto.subtle.digest("SHA-256", hashInput);
  const recomputedHashB64 = encodeBase64(new Uint8Array(digest));

  if (recomputedHashB64 !== hashB64) {
    return false;
  }

  const signatureBuffer = decodeBase64(signB64);
  return await crypto.subtle.verify(
    selectedParams.sign,
    publicKey,
    signatureBuffer.buffer as ArrayBuffer,
    digest,
  );
}

function unixTimestampU64(): Uint8Array {
  const nowInSeconds = Math.floor(Date.now() / 1000);
  return encodeU64(BigInt(nowInSeconds));
}

function encodeU64(value: bigint): Uint8Array {
  const saltBuffer = new ArrayBuffer(8);
  const saltView = new DataView(saltBuffer);
  saltView.setBigUint64(0, value, true);
  return new Uint8Array(saltBuffer);
}

function decodeU64(buffer: Uint8Array): bigint {
  const saltView = new DataView(typedArrayToBuffer(buffer));
  return saltView.getBigUint64(0, true);
}

function concatBytes(...arrays: Uint8Array[]): Uint8Array<ArrayBuffer> {
  const totalLength = arrays.reduce((acc, arr) => acc + arr.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

function typedArrayToBuffer(array: Uint8Array): ArrayBuffer {
  return (array.buffer as ArrayBuffer).slice(
    array.byteOffset,
    array.byteLength + array.byteOffset,
  );
}
