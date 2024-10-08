import models from "../../config/models.json";
import { MessageFactory } from "@/services/MessageFactory";
import { ApiMessage, Message } from "@/types/apiTypes";
import { locales } from "./Locales";

export default class ApiCommonParams {
  model: string;
  messages: ApiMessage[];
  stream: boolean | undefined;

  constructor({
    model,
    messages,
    stream = true,
    coderPrompt,
  }: {
    model?: string;
    messages?: Message[];
    stream?: boolean;
    coderPrompt?: string;
  } = {}) {
    this.stream = stream;
    this.model = model || models.turbo;
    this.messages = messages ? MessageFactory.toApiMessage(messages) : [];

    // 处理提示词
    if (coderPrompt) {
      console.log('jj coderPrompt', coderPrompt);
      
      const messageFactory = new MessageFactory();

      this.messages = [
        messageFactory.createSystemApiMessage(locales.get(coderPrompt)),
        ...this.messages,
      ];
    }
  }
}
