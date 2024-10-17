export const i18n = {
  defaultLocale: "en",
  locales: ["zh", "en"],
  forceDefaultLocale: true,
  allowBrowserLanguageOverride: false,
} as const;

export type LocaleType = (typeof i18n)["locales"][number];

export interface I18nTranslations {
  en: typeof import("config/dictionaries/en.json");
  zh: typeof import("config/dictionaries/zh.json");
}
export interface I18nPageRoutes {
  en: keyof typeof import("config/dictionaries/en.json");
  zh: keyof typeof import("config/dictionaries/zh.json");
}

export type Translations = I18nTranslations[typeof i18n.defaultLocale];
export type PageRoutes = I18nPageRoutes[typeof i18n.defaultLocale];
