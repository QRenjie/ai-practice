import "server-only";
import { i18n, PageRoutes, type LocaleType } from "config/i18n";
import Locales from "./Locales";

// We enumerate all dictionaries here for better linting and typescript support
// We also get the default import for cleaner types
const dictionaries = {
  zh: () =>
    import("config/locales/zh.json").then((module) => module.default),
  en: () =>
    import("config/locales/en.json").then((module) => module.default),
};

export const getLocales = async <
  Lang extends LocaleType,
  Namespace extends PageRoutes
>(
  locale: Lang,
  namespace: Namespace
): Promise<Locales<Lang, Namespace>> => {
  const lang = i18n.locales.includes(locale)
    ? locale
    : (i18n.defaultLocale as Lang);

  const loader = dictionaries[lang] ?? dictionaries.zh;

  const source = await loader();

  return new Locales(source, lang, namespace);
};
