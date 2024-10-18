import rootConfig from "config/root.json";
import { AiMessageFactory } from "@/utils/AiMessageFactory";
import { ApiMessage, Message } from "@/types/apiTypes";
import { LocaleKey } from "@/types/workspace";
import Locales from "./Locales";
import { i18n, LocaleType, PageRoutes } from "config/i18n";

export default class ApiCommonParams {
  model: string;
  locale: LocaleKey;
  messages: ApiMessage[];
  stream: boolean | undefined;

  constructor({
    model,
    locale,
    messages,
    stream = true,
    coderPrompt,
    locales,
  }: {
    model?: string;
    locale?: LocaleKey;
    messages?: Message[];
    stream?: boolean;
    coderPrompt?: string;
    locales?: Locales<LocaleType, PageRoutes>;
  } = {}) {
    this.stream = stream;
    this.locale = locale || i18n.defaultLocale;
    this.model = model || rootConfig.defaultModel;
    this.messages = messages ? AiMessageFactory.toApiMessage(messages) : [];

    // 处理提示词
    if (coderPrompt && locales) {
      this.messages = [
        AiMessageFactory.createSystemApiMessage(locales.getByLocaleString(coderPrompt)),
        ...this.messages,
      ];
    }
  }
}
