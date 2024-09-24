import { WorkspaceContextType } from "./../context/WorkspaceContext";
import React from "react";
import { v4 as uuidv4 } from "uuid";
import { RefObject } from "react";
import { ChatHistory, Message } from "@/types/apiTypes";
import { CodeBlocks } from "@/utils/CodeBlocks";
import { CodeExtractor } from "@/utils/CodeExtractor";
import AIService from "./AIService";


export type ApplyData = { type: "html" | "python"; content: string };

export class ChatController {
  private inputRef: RefObject<HTMLInputElement> | null = null;
  aiService: AIService;

  constructor(
    public context: WorkspaceContextType,
    private setIsLoading: (isLoading: boolean) => void
  ) { 
    this.aiService = new AIService();
  }

  setInputRef(ref: RefObject<HTMLInputElement>) {
    this.inputRef = ref;
  }

  get state() {
    return this.context.state;
  }

  

  private formatAIResponse(response: string): string {
    const trimmedResponse = response.trim();

    if (CodeExtractor.isHtml(trimmedResponse)) {
      return `\`\`\`html\n${trimmedResponse}\n\`\`\``;
    }

    return trimmedResponse;
  }

  public async handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    const message = this.inputRef?.current?.value || "";
    if (!message.trim()) return;

    this.setIsLoading(true);
    try {
      const userMessage: ChatHistory = { role: "user", content: message };
      this.context.addChatMessage({
        id: uuidv4(),
        text: message,
        sender: "user",
        type: "text",
      });
      
      // 检查聊天历史是否为空
      const currentChatHistory = this.state.chatHistory || [];
      this.context.updateChatHistory([...currentChatHistory, userMessage]);

      const aiResponse = await this.aiService.callOpenAIStream(
        message,
        currentChatHistory // 使用可能为空的聊天历史
      );

      const formattedResponse = this.formatAIResponse(aiResponse.content);

      const newMessage: Message = {
        id: aiResponse.id,
        text: formattedResponse,
        sender: "bot",
        type: "markdown",
        codeBlocks: aiResponse.codeBlocks,
      }
      this.context.addChatMessage(newMessage);

      const botMessage: ChatHistory = {
        role: "assistant",
        content: aiResponse.content,
      };
      this.context.updateChatHistory([
        ...currentChatHistory,
        userMessage,
        botMessage,
      ]);

      this.updateMergedCodeBlocks(newMessage);
    } catch (error) {
      this.context.addChatMessage({
        id: uuidv4(),
        text: `抱歉，发生了错误: ${error instanceof Error ? error.message : "未知错误"
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
    const previousMergedBlocks = this.state.mergedCodeBlocks;
    const blocks = CodeBlocks.mergeCodeBlocks(previousMergedBlocks, message);
    console.log('blocks', blocks);
    this.context.updateMergedCodeBlocks(blocks);
  }


  public handleKeyPress = (e: React.KeyboardEvent<Element>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      this.handleSubmit(e as unknown as React.FormEvent);
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
}
