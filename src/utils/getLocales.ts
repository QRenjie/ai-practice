import "server-only";
import { i18n, type LocaleType } from "config/i18n";
import Locales from "./Locales";

// We enumerate all dictionaries here for better linting and typescript support
// We also get the default import for cleaner types
const dictionaries = {
  zh: () =>
    import("config/dictionaries/zh.json").then((module) => module.default),
  en: () =>
    import("config/dictionaries/en.json").then((module) => module.default),
};

export const getLocales = async (locale: LocaleType) => {
  locale = i18n.locales.includes(locale) ? locale : i18n.defaultLocale;

  const loader = dictionaries[locale] ?? dictionaries.zh;

  const source = await loader();

  return new Locales(source, locale);
};
