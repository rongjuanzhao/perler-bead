/**
 * Encodes a string in base64 representing the string in UTF-8.
 */
export function encodeStringToBase64(str: string): string {
  return encodeBase64(new TextEncoder().encode(str));
}

/**
 * Encodes a binary in base64 (URL-safe, no padding).
 */
export function encodeBase64(binary: Uint8Array): string {
  const binaryString = Array.from(binary)
    .map((byte) => String.fromCharCode(byte))
    .join("");

  const base64 = btoa(binaryString);

  // Make Base64 URL-safe
  return base64.replaceAll("=", "").replaceAll("+", "-").replaceAll("/", "_");
}

/**
 * Decodes a base64 string to a binary.
 */
export function decodeBase64(base64: string): Uint8Array {
  // Revert URL safety
  const padded = base64.padEnd(
    base64.length + ((4 - (base64.length % 4)) % 4),
    "=",
  );
  const urlSafe = padded.replaceAll("-", "+").replaceAll("_", "/");

  // Decode from Base64
  const binaryString = atob(urlSafe);

  return Uint8Array.from(binaryString, (c) => c.charCodeAt(0));
}
