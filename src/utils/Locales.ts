import { get } from "lodash-es";
import {
  I18nTranslations,
  LocaleType,
  PageRoutes,
  Translations,
} from "config/i18n";

export type { LocaleType, PageRoutes, Translations } from "config/i18n";

export type LocalesValue = {
  source: Translations;
  locale: LocaleType;
  namespace: PageRoutes;
};

export default class Locales<
  Lang extends LocaleType,
  Namespace extends PageRoutes
> {
  constructor(
    private readonly source: I18nTranslations[Lang],
    public readonly locale: Lang,
    public readonly namespace: Namespace
  ) {
    this.source = source;
    this.locale = locale;
    this.namespace = namespace;
  }

  toObject(): LocalesValue {
    return {
      source: this.source,
      locale: this.locale,
      namespace: this.namespace,
    };
  }

  get t(): I18nTranslations[Lang][Namespace] {
    return this.source[this.namespace];
  }

  format(
    key: keyof I18nTranslations[Lang][Namespace],
    params?: Record<string, string>
  ): string {
    return this.get(key).replace(
      /{{\s*([^{}\s]+)\s*}}/g,
      (match, p1) => params?.[p1] || match
    );
  }

  get(key: keyof I18nTranslations[Lang][Namespace]): string {
    return get(this.t, key, "") as string;

    // if (!key.startsWith("locale:")) {
    //   throw new Error("key must start with locale:");
    // }

    // const localeKey = key.split(":").slice(1);
    // return get(this.source, page ? `${page}.${localeKey}` : localeKey, "");
  }
}
