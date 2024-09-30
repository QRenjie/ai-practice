import { ChatComponentType } from "@/context/WorkspaceContext";
import models from "../../config/models.json";
import { MessageFactory } from "@/services/MessageFactory";
import { ApiMessage, Message } from "@/types/apiTypes";
import { PromptSelector } from "@/services/PromptSelector";

export default class ApiCommonParams {
  model: string;
  messages: ApiMessage[];
  stream: boolean | undefined;

  constructor({
    model,
    messages,
    componentType,
    stream = true,
  }: {
    model?: string;
    messages?: Message[];
    componentType?: ChatComponentType;
    stream?: boolean;
  } = {}) {
    this.stream = stream;
    this.model = model || models.turbo;
    this.messages = messages ? MessageFactory.toApiMessage(messages) : [];

    // 处理提示词
    // 如果componentType不为空，则将componentType对应的prompt添加到messages数组的最前面
    if (componentType) {
      this.messages = [
        PromptSelector.getPrompt(componentType),
        ...this.messages,
      ];
    }
  }
}
