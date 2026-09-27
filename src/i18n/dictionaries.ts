import { ja } from "@/src/i18n/locales/ja";
import { de, es, fr, pt } from "@/src/i18n/locales/europe";
import { id } from "@/src/i18n/locales/id";
import { it } from "@/src/i18n/locales/it";
import { ko } from "@/src/i18n/locales/ko";
import { ru } from "@/src/i18n/locales/ru";
import { th } from "@/src/i18n/locales/th";
import { vi } from "@/src/i18n/locales/vi";
import type { SupportedLocale } from "@/src/i18n/config";

type WidenDictionary<T> = T extends string
  ? string
  : T extends readonly (infer Item)[]
    ? readonly WidenDictionary<Item>[]
    : T extends object
      ? { readonly [Key in keyof T]: WidenDictionary<T[Key]> }
      : T;

export type LocaleDictionary = WidenDictionary<typeof ja>;

export const dictionaries: Record<SupportedLocale, LocaleDictionary> = {
  ja,
  de,
  fr,
  es,
  pt,
  it,
  id,
  ko,
  vi,
  th,
  ru,
};

export function getDictionary(locale: SupportedLocale): LocaleDictionary {
  return dictionaries[locale];
}
