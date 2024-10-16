export const i18n = {
  defaultLocale: "zh",
  locales: ["zh", "en"],
  forceDefaultLocale: true,
  allowBrowserLanguageOverride: false,
} as const;

export type LocaleType = (typeof i18n)["locales"][number];
