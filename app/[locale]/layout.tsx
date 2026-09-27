import { notFound } from "next/navigation";
import { isToolLocale, toolLocales } from "@/src/i18n/tool-site";

export function generateStaticParams() {
  return toolLocales.map((locale) => ({ locale }));
}

export default async function LocaleRootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isToolLocale(locale)) {
    notFound();
  }

  return children;
}
