/**
 * Shared media-tool definitions.
 *
 * Upload support is deliberately broader than preview support. R2 can retain
 * all listed media files, while browsers can only render a smaller, codec-
 * dependent subset. The UI uses these helpers to fall back to downloading
 * files that cannot be previewed locally.
 */

export const MEDIA_TOOL_KINDS = ["image", "video"] as const;

export type MediaToolKind = (typeof MEDIA_TOOL_KINDS)[number];

const IMAGE_EXTENSIONS = new Set([
  "jpg", "jpeg", "jpe", "jfif", "pjp", "pjpeg",
  "png", "apng", "gif", "webp", "avif", "bmp", "dib",
  "tif", "tiff", "heic", "heif", "heics", "heifs",
  "ico", "cur", "svg", "jxl",
]);

const VIDEO_EXTENSIONS = new Set([
  "mp4", "m4v", "webm", "mov", "qt", "mkv", "avi", "divx",
  "mpg", "mpeg", "m1v", "m2v", "m2ts", "mts", "ts", "vob",
  "3gp", "3g2", "ogv", "ogg", "flv", "f4v", "wmv", "asf", "mxf",
]);

const PREVIEWABLE_IMAGE_EXTENSIONS = new Set([
  "jpg", "jpeg", "jpe", "jfif", "pjp", "pjpeg", "png", "apng",
  "gif", "webp", "avif", "bmp", "ico", "cur",
]);

const PREVIEWABLE_VIDEO_EXTENSIONS = new Set([
  "mp4", "m4v", "webm", "ogv", "ogg",
]);

const PREVIEWABLE_IMAGE_CONTENT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/avif",
  "image/bmp",
  "image/x-icon",
  "image/vnd.microsoft.icon",
]);

const PREVIEWABLE_VIDEO_CONTENT_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/ogg",
]);

export const MEDIA_TOOL_CONFIG = {
  image: {
    slug: "image-to-url",
    sharePrefix: "i",
    title: "Image",
    accept: "image/*,.jpg,.jpeg,.png,.gif,.webp,.avif,.bmp,.tif,.tiff,.heic,.heif,.ico,.svg,.jxl",
    formats: "JPG, PNG, GIF, WebP, AVIF, BMP, TIFF, HEIC, SVG, and more",
  },
  video: {
    slug: "video-to-link",
    sharePrefix: "v",
    title: "Video",
    accept: "video/*,.mp4,.m4v,.webm,.mov,.mkv,.avi,.mpeg,.mpg,.3gp,.ogv,.flv,.wmv,.ts,.m2ts,.mts,.mxf",
    formats: "MP4, WebM, MOV, MKV, AVI, MPEG, 3GP, TS, and more",
  },
} as const satisfies Record<MediaToolKind, {
  slug: string;
  sharePrefix: string;
  title: string;
  accept: string;
  formats: string;
}>;

export function isMediaToolKind(value: unknown): value is MediaToolKind {
  return typeof value === "string" && (MEDIA_TOOL_KINDS as readonly string[]).includes(value);
}

export function getMediaToolSlug(kind: MediaToolKind): string {
  return MEDIA_TOOL_CONFIG[kind].slug;
}

export function getMediaSharePath(kind: MediaToolKind, uploadId: string): string {
  return `/${MEDIA_TOOL_CONFIG[kind].sharePrefix}/${uploadId}`;
}

/**
 * Classify a stored upload for its recipient experience. This deliberately
 * uses the same broad rules as the media upload tools, so an image or video
 * uploaded through Cloud Transfer receives the same dedicated share page as
 * one uploaded through a media-focused tool.
 */
export function getMediaToolKindForFile(
  fileName: string,
  contentType: string | null | undefined,
): MediaToolKind | null {
  const extension = getMediaFileExtension(fileName);
  const normalizedContentType = normalizeMediaContentType(contentType);

  if (normalizedContentType.startsWith("image/")) {
    return "image";
  }

  if (
    normalizedContentType.startsWith("video/") ||
    normalizedContentType === "application/ogg"
  ) {
    return "video";
  }

  if (IMAGE_EXTENSIONS.has(extension)) return "image";
  if (VIDEO_EXTENSIONS.has(extension)) return "video";

  return null;
}

/**
 * Return the canonical recipient path for a completed upload. Files outside
 * the supported image/video groups retain the existing generic download page.
 */
export function getSharePathForFile(
  fileName: string,
  contentType: string | null | undefined,
  uploadId: string,
): string {
  const kind = getMediaToolKindForFile(fileName, contentType);
  return kind ? getMediaSharePath(kind, uploadId) : `/s/${uploadId}`;
}

export function getMediaFileExtension(fileName: string): string {
  const normalized = fileName.split(/[\\/]/).pop()?.trim().toLowerCase() ?? "";
  const lastDot = normalized.lastIndexOf(".");
  return lastDot > 0 ? normalized.slice(lastDot + 1) : "";
}

export function normalizeMediaContentType(contentType: string | null | undefined): string {
  return contentType?.split(";", 1)[0].trim().toLowerCase() ?? "";
}

/**
 * Accept broad, ordinary media types at upload time. The content type is
 * supplied by the client, so this remains a routing/UX guard rather than an
 * antivirus or full media-sniffing solution.
 */
export function isAllowedMediaUpload(
  kind: MediaToolKind,
  fileName: string,
  contentType: string | null | undefined,
): boolean {
  const extension = getMediaFileExtension(fileName);
  const normalizedContentType = normalizeMediaContentType(contentType);

  if (kind === "image") {
    return normalizedContentType.startsWith("image/") || IMAGE_EXTENSIONS.has(extension);
  }

  return (
    normalizedContentType.startsWith("video/") ||
    normalizedContentType === "application/ogg" ||
    VIDEO_EXTENSIONS.has(extension)
  );
}

/**
 * Returns whether we should attempt an in-browser preview. Even a true result
 * is best-effort: a container such as MP4 can still use a codec unsupported by
 * the recipient's browser, which the client handles with a download fallback.
 */
export function isMediaPreviewSupported(
  kind: MediaToolKind,
  fileName: string,
  contentType: string | null | undefined,
): boolean {
  const extension = getMediaFileExtension(fileName);
  const normalizedContentType = normalizeMediaContentType(contentType);

  if (kind === "image") {
    return (
      PREVIEWABLE_IMAGE_CONTENT_TYPES.has(normalizedContentType) ||
      PREVIEWABLE_IMAGE_EXTENSIONS.has(extension)
    );
  }

  return (
    PREVIEWABLE_VIDEO_CONTENT_TYPES.has(normalizedContentType) ||
    PREVIEWABLE_VIDEO_EXTENSIONS.has(extension)
  );
}
