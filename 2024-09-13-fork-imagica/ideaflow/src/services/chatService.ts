import { WorkspaceContextType } from "./../context/WorkspaceContext";
import React from "react";
import { v4 as uuidv4 } from "uuid";
import { RefObject } from "react";
import { Message } from "@/types/apiTypes";
import { CodeBlocks } from "@/utils/CodeBlocks";
import { CodeExtractor } from "@/utils/CodeExtractor";
import AIService from "./AIService";

export type ApplyData = { type: "html" | "python"; content: string };

export class ChatController {
  private inputRef: RefObject<HTMLTextAreaElement> | null = null;
  aiService: AIService;

  constructor(
    public context: WorkspaceContextType,
    private setIsLoading: (isLoading: boolean) => void
  ) {
    this.aiService = new AIService();
  }

  setInputRef(ref: RefObject<HTMLTextAreaElement>) {
    this.inputRef = ref;
  }

  get state() {
    return this.context.state;
  }

  get chatMessages() {
    return this.context.state.chat.messages;
  }

  get mergedCodeBlocks() {
    return this.context.state.code.mergedCodeBlocks;
  }

  private formatAIResponse(response: string): string {
    const trimmedResponse = response.trim();

    if (CodeExtractor.isHtml(trimmedResponse)) {
      return `\`\`\`html\n${trimmedResponse}\n\`\`\``;
    }

    return trimmedResponse;
  }

  public async handleSubmit(): Promise<void> {
    const message = this.inputRef?.current?.value || "";
    if (!message.trim()) return;

    this.setIsLoading(true);
    try {
      const userMessage: Message = {
        id: uuidv4(),
        text: message,
        sender: "user",
        type: "text",
      };
      this.context.addChatMessage(userMessage);

      const aiResponse = await this.aiService.callOpenAIStream(
        message,
        this.chatMessages // 使用 messages 替代 history
      );

      const formattedResponse = this.formatAIResponse(aiResponse.content);

      const newMessage: Message = {
        id: aiResponse.id,
        text: formattedResponse,
        sender: "bot",
        type: "markdown",
        codeBlocks: aiResponse.codeBlocks,
      };
      this.context.addChatMessage(newMessage);

      this.updateMergedCodeBlocks(newMessage);

      this.fetchNewRecommendedKeywords([...this.chatMessages, newMessage]);
    } catch (error) {
      this.context.addChatMessage({
        id: uuidv4(),
        text: `抱歉，发生了错误: ${
          error instanceof Error ? error.message : "未知错误"
        }`,
        sender: "bot",
        type: "text",
      });
    } finally {
      this.setIsLoading(false);
      if (this.inputRef?.current) {
        this.inputRef.current.value = "";
      }
    }
  }

  private updateMergedCodeBlocks(message: Message): void {
    const previousMergedBlocks = this.mergedCodeBlocks;
    const blocks = CodeBlocks.mergeCodeBlocks(previousMergedBlocks, message);
    this.context.updateMergedCodeBlocks(blocks);
  }

  public handleKeyPress = (e: React.KeyboardEvent<Element>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      this.handleSubmit();
    }
  };

  public copyToClipboard = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("无法复制文本: ", err);
    }
  };

  public handleReapplyCode = (code: string): void => {
    console.log(code);
  };

  fetchNewRecommendedKeywords = async (messages: Message[]) => {
    if (messages.length >= 2) {
      try {
        const aiService = new AIService();
        const response = await aiService.getRecommendedKeywords(messages);
        if (response.keywords && response.keywords.length > 0) {
          this.context.updateRecommendedKeywords(response.keywords);
        } else {
          console.warn("未收到有效的关键词");
        }
      } catch (error) {
        console.error("获取推荐关键词失败:", error);
      }
    }
  };
}
