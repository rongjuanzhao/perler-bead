/**
 * Generates a short random hexadecimal ID (4 hex chars, e.g. "A3F7").
 */
function generateShortId(): string {
  const bytes = new Uint8Array(2);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).toUpperCase().padStart(2, "0"))
    .join("");
  return hex;
}

/**
 * Generates a device alias based on a pre-parsed device info string plus a short random ID.
 * Example: "Windows · Chrome A3F7", "iOS · Safari 9B2E"
 */
export function generateRandomAlias(deviceInfo?: string): string {
  return `${deviceInfo || "Unknown"} ${generateShortId()}`;
}
