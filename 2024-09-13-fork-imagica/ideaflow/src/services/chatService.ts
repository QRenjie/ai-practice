import React from "react";
import { CodeExtractorImpl } from "../utils/CodeExtractor";
import { v4 as uuidv4 } from "uuid";
import { RefObject } from 'react';
import { WorkspaceState } from "@/context/WorkspaceContext";
import { CodeBlock } from "@/types/apiTypes";

export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  type: "text" | "code" | "markdown";
  codeBlocks?: CodeBlock[];
}

export interface ChatHistory {
  role: string;
  content: string;
}

export type ApplyData = { type: "html" | "python"; content: string };

export type OnUpdatePreviewCallback = (data: ApplyData) => void;

export class ChatController {
  private inputRef: RefObject<HTMLInputElement> | null = null;

  constructor(
    private addChatMessage: (message: Message) => void,
    private updateChatHistory: (history: ChatHistory[]) => void,
    private setIsLoading: (isLoading: boolean) => void,
    private onUpdatePreview: OnUpdatePreviewCallback,
    public state: WorkspaceState,
    private setMessages: (updater: (prev: Message[]) => Message[]) => void
  ) { }

  setInputRef(ref: RefObject<HTMLInputElement>) {
    this.inputRef = ref;
  }

  // 新增使用流式请求的方法
  private async callOpenAIStream(
    message: string,
    history: ChatHistory[]
  ): Promise<{ id: string; content: string; codeBlocks: CodeBlock[] }> {
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

      this.addChatMessage({
        id: data.id,
        text: data.content,
        sender: "bot",
        type: "markdown",
        codeBlocks: data.codeBlocks
      });

      return { id: data.id, content: data.content, codeBlocks: data.codeBlocks };
    } catch (error) {
      console.error('AI响应错误:', error);
      throw error;
    }
  }

  private updateMessage(messageId: string, content: string) {
    this.setMessages((prev) => {
      const newMessages = [...prev];
      const index = newMessages.findIndex(msg => msg.id === messageId);
      if (index !== -1) {
        newMessages[index] = {
          ...newMessages[index],
          text: content
        };
      }
      return newMessages;
    });
  }

  private formatAIResponse(response: string): string {
    const trimmedResponse = response.trim();

    if (
      trimmedResponse.startsWith("<") &&
      trimmedResponse.endsWith(">") &&
      !trimmedResponse.includes("\n") &&
      !trimmedResponse.includes("```")
    ) {
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
      this.addChatMessage({ id: uuidv4(), text: message, sender: "user", type: "text" });
      this.updateChatHistory([...this.state.chatHistory, userMessage]);

      const aiResponse = await this.callOpenAIStream(
        message,
        this.state.chatHistory
      );

      const formattedResponse = this.formatAIResponse(aiResponse.content);

      const botMessage: ChatHistory = {
        role: "assistant",
        content: formattedResponse,
      };
      this.updateChatHistory([...this.state.chatHistory, userMessage, botMessage]);

      this.handleCodePreview(formattedResponse);
    } catch (error) {
      this.addChatMessage({
        id: uuidv4(),
        text: `抱歉，发生了错误: ${error instanceof Error ? error.message : '未知错误'}`,
        sender: "bot",
        type: "text"
      });
    } finally {
      this.setIsLoading(false);
      if (this.inputRef?.current) {
        this.inputRef.current.value = "";
      }
    }
  }

  private handleCodePreview(formattedResponse: string): void {
    const extractor = new CodeExtractorImpl();

    // 首先尝试提取 Python 代码
    const pythonCodeMatch = formattedResponse.match(/```python\n([\s\S]*?)\n```/);
    if (pythonCodeMatch) {
      try {
        this.onUpdatePreview({ type: "python", content: pythonCodeMatch[1].trim() });
        return; // 如果成功处理了 Python 代码，就直接返回
      } catch (error) {
        console.error("处理 Python 代码时出错:", error);
      }
    }

    // 如果没有 Python 代码或处理失败，尝试提取 HTML/CSS/JS
    const { htmlCode, cssCode, jsCode } = extractor.extract(formattedResponse);
    if (htmlCode || cssCode || jsCode) {
      try {
        const fullHtmlContent = extractor.generateHtmlContent(htmlCode, cssCode, jsCode);
        this.onUpdatePreview({ type: "html", content: fullHtmlContent });
      } catch (error) {
        console.error("处理 HTML/CSS/JS 代码时出错:", error);
      }
    } else {
      console.warn("未找到可预览的代码");
    }
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
    const extractor = new CodeExtractorImpl();
    const { htmlCode, cssCode, jsCode } = extractor.extract(code);
    const fullHtmlContent = extractor.generateHtmlContent(
      htmlCode,
      cssCode,
      jsCode
    );
    this.onUpdatePreview({ type: "html", content: fullHtmlContent });
  };

  private async simulateStreamResponse(content: string): Promise<void> {
    const chunkSize = Math.floor(Math.random() * 11) + 10; // 10-20之间的随机数
    let displayedContent = "";
    const messageId = uuidv4(); // 为整个流式响应生成一个唯一id

    // 先添加一个空的消息
    this.addChatMessage({ id: messageId, text: "", sender: "bot", type: "markdown" });

    for (let i = 0; i < content.length; i += chunkSize) {
      const chunk = content.slice(i, i + chunkSize);
      displayedContent += chunk;
      await new Promise((resolve) => setTimeout(resolve, 50));

      // 更新消息内容
      this.setMessages((prev) => {
        const newMessages = [...prev];
        const lastMessageIndex = newMessages.findIndex(msg => msg.id === messageId);
        if (lastMessageIndex !== -1) {
          newMessages[lastMessageIndex] = {
            ...newMessages[lastMessageIndex],
            text: displayedContent
          };
        }
        return newMessages;
      });
    }
  }
}
