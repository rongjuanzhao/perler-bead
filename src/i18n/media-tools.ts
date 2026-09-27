import {
  defaultLocale,
  type SupportedLocale,
} from "@/src/i18n/config";
import {
  getMediaToolSlug,
  type MediaToolKind,
} from "@/src/lib/media";

export type MediaToolLocale = typeof defaultLocale | SupportedLocale;

export type MediaToolPageCopy = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  description: string;
  uploadTitle: string;
  uploadDescription: string;
  previewNotice: string;
  steps: Array<{ title: string; description: string }>;
  benefits: Array<{ title: string; description: string }>;
  faqs: Array<{ question: string; answer: string }>;
};

const englishCopies: Record<MediaToolKind, MediaToolPageCopy> = {
  image: {
    metaTitle: "Image to URL – Upload Images and Get a Shareable URL | Quick Share",
    metaDescription:
      "Use Image to URL to upload an image and get a temporary shareable image URL. Preview supported images online and download every image file from any device.",
    eyebrow: "Image to URL tool",
    title: "Image to URL: Upload an Image and Get a Shareable URL",
    description:
      "Use this Image to URL tool to upload an image, create a shareable image URL, and let recipients preview or download it before the link expires.",
    uploadTitle: "Upload an image to get a URL",
    uploadDescription:
      "Upload an image to create a temporary image URL. Common web images preview in the browser; every supported image remains available to download.",
    previewNotice:
      "Preview support depends on the recipient's browser. Files that cannot be previewed can still be downloaded.",
    steps: [
      { title: "Upload an image", description: "Drop an image file or choose one from your device for Image to URL." },
      { title: "Get an image URL", description: "Quick Share uploads the file securely and creates a temporary shareable image URL." },
      { title: "Share the image URL", description: "Recipients open a clean image page to preview or download the image file." },
    ],
    benefits: [
      { title: "Image to URL for broad formats", description: "Upload common web, camera, and archive image formats in one image URL tool." },
      { title: "Temporary image URLs", description: "Free image URLs expire after 3 days; Pro image links can remain available for up to 30 days." },
      { title: "One clean image sharing page", description: "Recipients get an image preview when their browser supports it, plus a download option." },
    ],
    faqs: [
      { question: "How do I turn an image into a URL?", answer: "Use the Image to URL uploader to select an image, upload it, and copy the temporary shareable image URL that Quick Share creates." },
      { question: "Which image formats can I upload to Image to URL?", answer: "You can upload common image formats including JPG, PNG, GIF, WebP, AVIF, BMP, TIFF, HEIC, SVG, and other image files. Browser previews are best for common web image formats." },
      { question: "How long does an Image to URL link stay active?", answer: "Free image links expire after 3 days. Pro users can choose 3, 7, 14, or 30 days when using the Image to URL tool." },
      { question: "What happens if an image cannot be previewed?", answer: "The image URL recipient page shows the file details and a download button, so the image remains accessible even when that browser cannot render it." },
      { question: "Can I protect an image link?", answer: "Pro users can add an access code before sharing. Recipients must enter the code before previewing or downloading the file." },
    ],
  },
  video: {
    metaTitle: "Video to Link – Upload Videos and Get a Shareable Link | Quick Share",
    metaDescription:
      "Use Video to Link to upload a video and get a temporary shareable video link. Compatible videos play online, and every supported video file can be downloaded.",
    eyebrow: "Video to Link tool",
    title: "Video to Link: Upload a Video and Get a Shareable Link",
    description:
      "Use this Video to Link tool to upload a video, create a shareable video link, and let recipients watch compatible files or download any supported format.",
    uploadTitle: "Upload a video to get a link",
    uploadDescription:
      "Upload a video to create a temporary video link. Compatible browser formats play online; all supported video files remain downloadable.",
    previewNotice:
      "Online playback depends on the file's browser-compatible codec. If it cannot play here, the recipient can still download it.",
    steps: [
      { title: "Upload a video", description: "Drop a video file or choose one from your device for Video to Link." },
      { title: "Get a video link", description: "Quick Share stores the file securely and creates a temporary shareable video link." },
      { title: "Share the video link", description: "Recipients open a dedicated video page with playback when supported and a download fallback for every file." },
    ],
    benefits: [
      { title: "Video to Link for broad formats", description: "Upload common camera, editing, and web video formats without re-encoding them." },
      { title: "Temporary video links", description: "Free video links expire after 3 days; Pro video links can remain available for up to 30 days." },
      { title: "Video playback when possible", description: "Compatible browser video files play on the Video to Link sharing page, while all other supported files remain downloadable." },
    ],
    faqs: [
      { question: "How do I turn a video into a link?", answer: "Use Video to Link to choose a video, upload it, and copy the temporary shareable video link that Quick Share creates." },
      { question: "Which video formats can I upload to Video to Link?", answer: "You can upload MP4, WebM, MOV, MKV, AVI, MPEG, 3GP, TS, WMV, and other video files. The Video to Link tool accepts broad video formats even when a browser cannot preview every one." },
      { question: "Will every Video to Link upload play in the browser?", answer: "No. Online playback depends on both the container and video codec. MP4 and WebM are most commonly previewable; unsupported video links are always available to download." },
      { question: "How long does a Video to Link link stay active?", answer: "Free video links expire after 3 days. Pro users can choose 3, 7, 14, or 30 days when using Video to Link." },
      { question: "Can I protect a video link?", answer: "Pro users can add an access code before sharing. Recipients must enter the code before watching or downloading the file." },
    ],
  },
};

/**
 * Add a locale only after its route and human-reviewed copy are published.
 * This keeps untranslated tool pages out of hreflang and sitemap output.
 */
const publishedToolCopies: Partial<Record<MediaToolLocale, Record<MediaToolKind, MediaToolPageCopy>>> = {
  en: englishCopies,
};

export function getMediaToolPageCopy(
  locale: MediaToolLocale,
  kind: MediaToolKind,
): MediaToolPageCopy {
  return publishedToolCopies[locale]?.[kind] ?? englishCopies[kind];
}

export function getPublishedMediaToolLocales(kind: MediaToolKind): readonly MediaToolLocale[] {
  return (Object.keys(publishedToolCopies) as MediaToolLocale[]).filter(
    (locale) => Boolean(publishedToolCopies[locale]?.[kind]),
  );
}

export function getMediaToolLanguageAlternates(kind: MediaToolKind): Record<string, string> {
  const slug = getMediaToolSlug(kind);
  const paths = getPublishedMediaToolLocales(kind).map((locale) => [
    locale,
    locale === defaultLocale
      ? `https://quick-share.app/${slug}`
      : `https://quick-share.app/${locale}/${slug}`,
  ]);

  return {
    ...Object.fromEntries(paths),
    "x-default": `https://quick-share.app/${slug}`,
  };
}
