import models from "../../config/models.json";
import rootConfig from "../../config/root.json";
import { MessageFactory } from "@/services/MessageFactory";
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
    this.model = model || models.turbo;
    this.messages = messages ? MessageFactory.toApiMessage(messages) : [];

    // 处理提示词
    if (coderPrompt) {
      const messageFactory = new MessageFactory();

      this.messages = [
        messageFactory.createSystemApiMessage(locales.get(coderPrompt, this.locale)),
        ...this.messages,
      ];
    }
  }
}
