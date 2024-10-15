import { AiChatResponse, ApiMessage, Message } from "@/types/apiTypes";
import { pick } from "lodash-es";
import { Uid } from "./Uid";

export class AiMessageFactory {
  static toApiMessage(messages: Message[]): ApiMessage[] {
    return messages.map((message) => pick(message, ["role", "content"]));
  }

  static createUserMessage(content: string): Message {
    return {
      id: Uid.generate(),
      content,
      role: "user",
      type: "text",
    };
  }

  static createSystemApiMessage(content: string): ApiMessage {
    return {
      content,
      role: "system",
    };
  }

  static createAssistantMessage(aiResponse: AiChatResponse): Message {
    return {
      id: aiResponse.id,
      content: aiResponse.content,
      role: "assistant",
      type: "markdown",
      codeBlocks: aiResponse.codeBlocks,
    };
  }

  static createErrorMessage(error: unknown): Message {
    return {
      id: Uid.generate(),
      content: `抱歉，发生了错误: ${
        error instanceof Error ? error.message : "未知错误"
      }`,
      role: "assistant",
      type: "text",
    };
  }
}
