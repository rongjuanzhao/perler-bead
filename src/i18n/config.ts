export const defaultLocale = "en";

export const supportedLocales = [
  "ja",
  "de",
  "fr",
  "es",
  "pt",
  "it",
  "id",
  "ko",
  "vi",
  "th",
  "ru",
] as const;

export type SupportedLocale = (typeof supportedLocales)[number];

export const localeLabels: Record<typeof defaultLocale | SupportedLocale, string> = {
  en: "English",
  ja: "日本語",
  de: "Deutsch",
  fr: "Français",
  es: "Español",
  pt: "Português",
  it: "Italiano",
  id: "Bahasa Indonesia",
  ko: "한국어",
  vi: "Tiếng Việt",
  th: "ไทย",
  ru: "Русский",
};

export const metadataLocales: Record<SupportedLocale, string> = {
  ja: "ja_JP",
  de: "de_DE",
  fr: "fr_FR",
  es: "es_ES",
  pt: "pt_BR",
  it: "it_IT",
  id: "id_ID",
  ko: "ko_KR",
  vi: "vi_VN",
  th: "th_TH",
  ru: "ru_RU",
};

export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return supportedLocales.includes(locale as SupportedLocale);
}

export function getLocaleFromPathname(pathname: string): SupportedLocale | typeof defaultLocale {
  const segment = pathname.split("/").filter(Boolean)[0];
  return segment && isSupportedLocale(segment) ? segment : defaultLocale;
}

export function getLanguageAlternates(path = ""): Record<string, string> {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const englishPath = normalizedPath === "/" ? "/" : normalizedPath;
  const localizedPath = normalizedPath === "/" ? "" : normalizedPath;

  return {
    en: `https://quick-share.app${englishPath}`,
    ...Object.fromEntries(
      supportedLocales.map((locale) => [
        locale,
        `https://quick-share.app/${locale}${localizedPath}`,
      ]),
    ),
    "x-default": `https://quick-share.app${englishPath}`,
  };
}
