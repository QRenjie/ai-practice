import { get } from "lodash-es";
import { LocaleType } from "config/i18n";

export type Translations = typeof import("config/dictionaries/en.json");

export default class Locales {
  constructor(
    private source: Translations,
    public readonly locale: LocaleType
  ) {
    this.source = source;
    this.locale = locale;
  }

  get t(): Translations {
    return this.source;
  }

  /**
   * 获取locale字符串
   * @param locale {string} locale:xxxx
   * @param key {LocaleType}
   * @returns
   */
  get(key: string): string {
    if (!key.startsWith("locale:")) {
      throw new Error("key must start with locale:");
    }

    const localeKey = key.split(":").slice(1);
    return get(this.source, localeKey, "");
  }
}

export const locales = new Locales({}, "zh");
