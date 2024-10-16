import rootConfig from "config/root.json";
import { AiMessageFactory } from "@/utils/AiMessageFactory";
import { ApiMessage, Message } from "@/types/apiTypes";
import { locales } from "./Locales";
import { LocaleKey } from "@/types/workspace";

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
  }: {
    model?: string;
    locale?: LocaleKey;
    messages?: Message[];
    stream?: boolean;
    coderPrompt?: string;
  } = {}) {
    this.stream = stream;
    this.locale = locale || rootConfig.defaultLocale;
    this.model = model || rootConfig.defaultModel;
    this.messages = messages ? AiMessageFactory.toApiMessage(messages) : [];

    // 处理提示词
    if (coderPrompt) {

      this.messages = [
        AiMessageFactory.createSystemApiMessage(
          locales.get(coderPrompt, this.locale)
        ),
        ...this.messages,
      ];
    }
  }
}
