import { get } from "lodash-es";
import localesJson from "../../config/locales.json";

type LanguageType = keyof typeof localesJson;
export default class Locales {
  locale: LanguageType = "zh";

  /**
   * 获取locale字符串
   * @param locale {string} locale:xxxx
   * @param key {LanguageType}
   * @returns
   */
  get(key: string, locale: string = this.locale): string {
    if (!key.startsWith("locale:")) {
      throw new Error("key must start with locale:");
    }

    const localeKey = key.split(":").slice(1);
    return get(localesJson, [locale, ...localeKey], '');
  }
}

export const locales = new Locales();
