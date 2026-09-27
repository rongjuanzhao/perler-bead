import type { MetadataRoute } from "next";
import { defaultToolLocale, getToolPath, toolLocales } from "@/src/i18n/tool-site";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://video2frames.net").replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const getPublicUrl = (locale: (typeof toolLocales)[number]) =>
    locale === defaultToolLocale ? siteUrl + "/" : siteUrl + getToolPath(locale, "/video-to-frames");
  const languages = {
    ...Object.fromEntries(toolLocales.map((locale) => [locale, getPublicUrl(locale)])),
    "x-default": siteUrl + "/",
  };

  const toolPages: MetadataRoute.Sitemap = toolLocales.map((locale) => ({
    url: getPublicUrl(locale),
    lastModified,
    changeFrequency: "weekly",
    priority: 1,
    alternates: {
      languages,
    },
  }));

  return [
    ...toolPages,
    {
      url: siteUrl + "/privacy-policy",
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: siteUrl + "/terms-of-service",
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
