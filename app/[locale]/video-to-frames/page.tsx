import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import {
  createVideoToFramesStructuredData,
  VideoToFramesLanding,
  videoToFramesDescription,
  videoToFramesTitle,
} from "@/src/components/video-to-frames/VideoToFramesLanding";
import {
  defaultToolLocale,
  getToolPath,
  isToolLocale,
  toolLocales,
  type ToolLocale,
} from "@/src/i18n/tool-site";

type LocalePageProps = {
  params: Promise<{ locale: string }>;
};

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://video2frames.net").replace(/\/$/, "");

function getPublicToolPath(locale: ToolLocale) {
  return locale === defaultToolLocale ? "/" : getToolPath(locale, "/video-to-frames");
}

function getLanguageAlternates() {
  return {
    ...Object.fromEntries(toolLocales.map((locale) => [locale, getPublicToolPath(locale)])),
    "x-default": "/",
  };
}

export function generateStaticParams() {
  return toolLocales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocalePageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isToolLocale(locale)) {
    return {};
  }

  const canonical = getPublicToolPath(locale);

  return {
    title: {
      absolute: videoToFramesTitle,
    },
    description: videoToFramesDescription,
    alternates: {
      canonical,
      languages: getLanguageAlternates(),
    },
    openGraph: {
      title: videoToFramesTitle,
      description: videoToFramesDescription,
      type: "website",
      url: canonical,
      siteName: "Video to Frames",
    },
    twitter: {
      card: "summary_large_image",
      title: videoToFramesTitle,
      description: videoToFramesDescription,
    },
  };
}

export default async function VideoToFramesPage({ params }: LocalePageProps) {
  const { locale } = await params;

  if (!isToolLocale(locale)) {
    notFound();
  }

  if (locale === defaultToolLocale) {
    permanentRedirect("/");
  }

  const toolPath = getPublicToolPath(locale);

  return <VideoToFramesLanding toolPath={toolPath} structuredData={createVideoToFramesStructuredData(siteUrl + toolPath)} />;
}
