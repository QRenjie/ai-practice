import { v4 as uuidv4 } from "uuid";
import { AiChatResponse, ApiMessage, Message } from "@/types/apiTypes";
import { pick } from "lodash-es";

export class MessageFactory {
  static toApiMessage(messages: Message[]): ApiMessage[] {
    return messages.map((message) => pick(message, ["role", "content"]));
  }

  createUserMessage(content: string): Message {
    return {
      id: uuidv4(),
      content,
      role: "user",
      type: "text",
    };
  }

  createAssistantMessage(
    aiResponse: AiChatResponse
  ): Message {
    return {
      id: aiResponse.id,
      content: aiResponse.content,
      role: "assistant",
      type: "markdown",
      codeBlocks: aiResponse.codeBlocks,
    };
  }

  createErrorMessage(error: unknown): Message {
    return {
      id: uuidv4(),
      content: `抱歉，发生了错误: ${
        error instanceof Error ? error.message : "未知错误"
      }`,
      role: "assistant",
      type: "text",
    };
  }
}
