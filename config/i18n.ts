export const i18n = {
  defaultLocale: "zh",
  locales: ["en", "zh"],
} as const;

export type LocaleType = (typeof i18n)["locales"][number];
