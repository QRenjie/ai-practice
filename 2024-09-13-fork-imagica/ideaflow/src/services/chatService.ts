import { WorkspaceContextType } from "./../context/WorkspaceContext";
import React from "react";
import { v4 as uuidv4 } from "uuid";
import { RefObject } from "react";
import { AIResponseData, Message } from "@/types/apiTypes";
import { CodeBlocks } from "@/utils/CodeBlocks";
import { CodeExtractor } from "@/utils/CodeExtractor";

export interface ChatHistory {
  role: string;
  content: string;
}

export type ApplyData = { type: "html" | "python"; content: string };

export class ChatController {
  private inputRef: RefObject<HTMLInputElement> | null = null;

  constructor(
    public context: WorkspaceContextType,
    private setIsLoading: (isLoading: boolean) => void
  ) { }

  setInputRef(ref: RefObject<HTMLInputElement>) {
    this.inputRef = ref;
  }

  get state() {
    return this.context.state;
  }

  // 新增使用流式请求的方法
  private async callOpenAIStream(message: string, history: ChatHistory[]): Promise<AIResponseData> {
    try {
      const response = await fetch("/api/ai-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          history,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP错误！状态：${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.error("AI响应错误:", error);
      throw error;
    }
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
      this.context.updateChatHistory([...this.state.chatHistory, userMessage]);

      const aiResponse = await this.callOpenAIStream(
        message,
        this.context.state.chatHistory
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
        ...this.state.chatHistory,
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

  public handleReapplyCode = (): void => { };
}
