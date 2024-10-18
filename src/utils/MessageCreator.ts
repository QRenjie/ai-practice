import { AiChatResponse, ApiMessage, Message } from "@/types/apiTypes";
import { Uid } from "./Uid";
import { pick } from "lodash-es";
import { CodeBlocks } from "./CodeBlocks";
import { log } from "./log";

export class MessageCreator {
  static createUserMessage(content: string): Message {
    return {
      id: Uid.generate(),
      content,
      role: "user",
      type: "text",
    };
  }

  static createSystemMessage(content: string): Message {
    return {
      id: Uid.generate(),
      content,
      role: "system",
      type: "text",
    };
  }

  static createAssistantMessage(
    aiResponse: AiChatResponse,
    targetMessage?: Message
  ): Message {
    const message: Message = {
      id: aiResponse.id,
      content: aiResponse.content,
      role: "assistant",
      type: "markdown",
      codeBlocks: aiResponse.codeBlocks,
    };

    // 如果targetMessage有codeBlocks，则合并
    const targetMergeBlocks = targetMessage?.codeBlocks || [];
    if (targetMergeBlocks.length > 0) {
      const blocks = CodeBlocks.mergeCodeBlocks(targetMergeBlocks, message);
      log.debug("merge blocks", blocks);
      message.codeBlocks = blocks;
    }

    return message;
  }

  static createErrorMessage(error: unknown): Message {
    return {
      id: Uid.generate(),
      // TODO: 国际化
      content: `抱歉，发生了错误: ${
        error instanceof Error ? error.message : "未知错误"
      }`,
      role: "assistant",
      type: "text",
    };
  }

  static toApiMessage(messages: Message[]): ApiMessage[] {
    return messages.map((message) => pick(message, ["role", "content"]));
  }

  static getPreviousAiMessage(chatMessages: Message[]): Message | undefined {
    return chatMessages.findLast((message) => message.role === "assistant");
  }
}
