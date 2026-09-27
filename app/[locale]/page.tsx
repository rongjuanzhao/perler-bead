import { notFound, permanentRedirect } from "next/navigation";
import { defaultToolLocale, getToolPath, isToolLocale, toolLocales } from "@/src/i18n/tool-site";

type LocalePageProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return toolLocales.map((locale) => ({ locale }));
}

export default async function LocalizedHomePage({ params }: LocalePageProps) {
  const { locale } = await params;

  if (!isToolLocale(locale)) {
    notFound();
  }

  permanentRedirect(locale === defaultToolLocale ? "/" : getToolPath(locale, "/video-to-frames"));
}
