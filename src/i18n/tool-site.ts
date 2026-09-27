/**
 * English is served from the root URL. Add a locale here only when its copy is
 * ready; non-default locales use /{locale}/... while the default stays at /.
 */
export const toolLocales = ["en"] as const;

export type ToolLocale = (typeof toolLocales)[number];

export const defaultToolLocale: ToolLocale = "en";

export const toolLocaleLabels: Record<ToolLocale, string> = {
  en: "English",
};

export function isToolLocale(value: string): value is ToolLocale {
  return (toolLocales as readonly string[]).includes(value);
}

export function getToolPath(locale: ToolLocale, path = ""): string {
  const normalizedPath = path && !path.startsWith("/") ? "/" + path : path;
  return "/" + locale + normalizedPath;
}
