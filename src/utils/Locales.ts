import { get } from "lodash-es";
import { LocaleType, PageRoutes, Translations } from "config/i18n";

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
    private readonly source: Translations,
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

  get t(): Translations[typeof this.namespace] {
    return this.source[this.namespace];
  }

  get(key: keyof Translations[Namespace]): string {
    return get(this.source, key, "");

    // if (!key.startsWith("locale:")) {
    //   throw new Error("key must start with locale:");
    // }

    // const localeKey = key.split(":").slice(1);
    // return get(this.source, page ? `${page}.${localeKey}` : localeKey, "");
  }
}
