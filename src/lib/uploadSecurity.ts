/**
 * Upload security checks shared by the browser and the Worker.
 *
 * The filename/MIME check is a fast first line of defence. The signature check
 * is deliberately separate because both a filename and a client-provided MIME
 * type can be forged.
 */

export const UPLOAD_SIGNATURE_SCAN_BYTES = 64 * 1024;

export const UNSUPPORTED_EXECUTABLE_FILE_ERROR_CODE = "unsupported_executable_file";
export const UNSUPPORTED_EXECUTABLE_FILE_MESSAGE =
  "Executable files and scripts are not supported.";

const BLOCKED_UPLOAD_EXTENSIONS = new Set([
  // Windows executables, installers, and shortcuts.
  "exe", "dll", "com", "msi", "msp", "msix", "msixbundle", "appx", "appxbundle",
  "bat", "cmd", "scr", "pif", "cpl", "ocx", "sys", "drv", "reg", "lnk", "url",
  "scf", "inf",
  // Android and Java packages.
  "apk", "apks", "xapk", "aab", "jar", "war", "ear",
  // macOS, Linux, and disk images.
  "app", "appimage", "command", "dmg", "pkg", "run", "bin", "elf", "deb", "rpm",
  "flatpak", "flatpakref", "iso", "img",
  // Script files and interpreted source files.
  "ps1", "psm1", "psd1", "vbs", "vbe", "vb", "js", "jse", "wsf", "wsh", "hta",
  "sh", "bash", "zsh", "fish", "ksh", "csh", "py", "pyw", "pl", "pm", "rb",
  "php", "phar", "lua",
]);

const BLOCKED_UPLOAD_CONTENT_TYPES = new Set([
  "application/x-msdownload",
  "application/x-msdos-program",
  "application/x-dosexec",
  "application/vnd.microsoft.portable-executable",
  "application/x-ms-installer",
  "application/x-msi",
  "application/vnd.android.package-archive",
  "application/java-archive",
  "application/x-java-archive",
  "application/x-jar",
  "application/x-sh",
  "application/x-shellscript",
  "application/x-powershell",
  "application/x-executable",
  "application/x-elf",
  "application/x-mach-binary",
  "application/x-apple-diskimage",
  "application/x-iso9660-image",
  "application/javascript",
  "application/x-javascript",
  "text/javascript",
  "text/x-javascript",
  "text/x-shellscript",
  "text/x-python",
  "application/x-httpd-php",
]);

function normalizedFileName(fileName: unknown): string {
  if (typeof fileName !== "string") return "";

  return (fileName.split(/[\\/]/).pop() ?? "")
    .normalize("NFKC")
    .replace(/[\u0000-\u001F\u007F\u202A-\u202E\u2066-\u2069]/g, "")
    .trim()
    .replace(/[.\s]+$/, "")
    .toLowerCase();
}

function normalizedContentType(contentType: unknown): string {
  if (typeof contentType !== "string") return "";
  return contentType.split(";", 1)[0].trim().toLowerCase();
}

/**
 * Detects direct executable and script files using the filename and declared
 * content type. It is safe to call from both the browser and the Worker.
 */
export function isUnsupportedUploadFile(fileName: unknown, contentType?: unknown): boolean {
  const name = normalizedFileName(fileName);
  const lastDot = name.lastIndexOf(".");
  const extension = lastDot > 0 ? name.slice(lastDot + 1) : "";

  return (
    (extension.length > 0 && BLOCKED_UPLOAD_EXTENSIONS.has(extension)) ||
    BLOCKED_UPLOAD_CONTENT_TYPES.has(normalizedContentType(contentType))
  );
}

/**
 * Detects executable binary formats and executable shebang scripts from a
 * bounded prefix of an uploaded object. This is not an antivirus scanner.
 */
export function hasUnsupportedExecutableSignature(bytes: Uint8Array): boolean {
  if (bytes.length >= 2 && bytes[0] === 0x4d && bytes[1] === 0x5a) {
    // DOS/Windows PE files start with "MZ". Treating the whole DOS family as
    // blocked avoids relying on a filename supplied by the uploader.
    return true;
  }

  if (
    bytes.length >= 4 &&
    bytes[0] === 0x7f &&
    bytes[1] === 0x45 &&
    bytes[2] === 0x4c &&
    bytes[3] === 0x46
  ) {
    // ELF binaries.
    return true;
  }

  if (bytes.length >= 4) {
    const first = bytes[0];
    const second = bytes[1];
    const third = bytes[2];
    const fourth = bytes[3];
    const isMachO =
      (first === 0xfe && second === 0xed && third === 0xfa && fourth === 0xce) ||
      (first === 0xce && second === 0xfa && third === 0xed && fourth === 0xfe) ||
      (first === 0xfe && second === 0xed && third === 0xfa && fourth === 0xcf) ||
      (first === 0xcf && second === 0xfa && third === 0xed && fourth === 0xfe) ||
      (first === 0xca && second === 0xfe && third === 0xba && fourth === 0xbe) ||
      (first === 0xbe && second === 0xba && third === 0xfe && fourth === 0xca) ||
      (first === 0xca && second === 0xfe && third === 0xba && fourth === 0xbf) ||
      (first === 0xbf && second === 0xba && third === 0xfe && fourth === 0xca);

    if (isMachO) return true;
  }

  // A shebang makes a text file directly executable on Unix-like systems.
  return bytes.length >= 2 && bytes[0] === 0x23 && bytes[1] === 0x21;
}
