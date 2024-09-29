import { WorkspaceContextType } from "./../context/WorkspaceContext";
import React from "react";
import { v4 as uuidv4 } from "uuid";
import { RefObject } from "react";
import { ApiMessage, Message } from "@/types/apiTypes";
import { CodeBlocks } from "@/utils/CodeBlocks";
import { CodeExtractor } from "@/utils/CodeExtractor";
import AIService from "./AIService";
import { prompts } from "@/config/prompts";
import { pick } from "lodash-es";

export type ApplyData = { type: "html" | "python"; content: string };

function getApiMessage(messages: Message[]): ApiMessage[] {
  return messages.map((message) => pick(message, ["role", "content"]));
}

export class ChatController {
  private inputRef: RefObject<HTMLTextAreaElement> | null = null;
  aiService: AIService;

  constructor(
    public context: WorkspaceContextType,
    private setIsLoading: (isLoading: boolean) => void
  ) {
    this.aiService = new AIService();
    this.initRecommendedKeywords();
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
        content: message,
        role: "user",
        type: "text",
      };
      this.context.addChatMessage(userMessage);

      const aiResponse = await this.aiService.callOpenAIStream(
        message,
        getApiMessage(this.chatMessages)
      );

      const formattedResponse = this.formatAIResponse(aiResponse.content);

      const newMessage: Message = {
        id: aiResponse.id,
        content: formattedResponse,
        role: "assistant",
        type: "markdown",
        codeBlocks: aiResponse.codeBlocks,
      };
      this.context.addChatMessage(newMessage);

      this.updateMergedCodeBlocks(newMessage);

      const newMessages = [...this.chatMessages, newMessage];
      if (newMessages.length >= 2) {
        this.fetchNewRecommendedKeywords(getApiMessage(newMessages));
      }
    } catch (error) {
      this.context.addChatMessage({
        id: uuidv4(),
        content: `抱歉，发生了错误: ${
          error instanceof Error ? error.message : "未知错误"
        }`,
        role: "assistant",
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

  /**
   * 当message 为空时表示初始化提示词
   * @param messages 
   */
  fetchNewRecommendedKeywords = async (messages: ApiMessage[]) => {
    try {
      const aiService = new AIService();
      const prompt = messages.length === 0 
        ? prompts.initRecommond 
        : prompts.contextPromptTemplate.replace('{{chatHistory}}', messages.map(msg => msg.content).join('\n'));
      const response = await aiService.getRecommendedKeywords([{ role: "user", content: prompt }]);
      if (response.keywords && response.keywords.length > 0) {
        this.context.updateRecommendedKeywords(response.keywords);
      } else {
        console.warn("未收到有效的关键词");
      }
    } catch (error) {
      console.error("获取推荐关键词失败:", error);
    }
  };

  initRecommendedKeywords() {
    this.fetchNewRecommendedKeywords([]);
  }
}