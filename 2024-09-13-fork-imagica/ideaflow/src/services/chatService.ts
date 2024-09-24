import { WorkspaceContextType } from "./../context/WorkspaceContext";
import React from "react";
import { CodeExtractorImpl } from "../utils/CodeExtractor";
import { v4 as uuidv4 } from "uuid";
import { RefObject } from "react";
import { AIResponseData, CodeBlock, Message } from "@/types/apiTypes";
import { CodeBlocks } from "@/utils/CodeBlocks";

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
        text: aiResponse.content,
        sender: "bot",
        type: "markdown",
        codeBlocks: aiResponse.codeBlocks,
      }
      this.context.addChatMessage(newMessage);

      const botMessage: ChatHistory = {
        role: "assistant",
        content: formattedResponse,
      };
      this.context.updateChatHistory([
        ...this.state.chatHistory,
        userMessage,
        botMessage,
      ]);

      this.handleCodePreview(formattedResponse);
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

  private handleCodePreview(formattedResponse: string): void {
    const extractor = new CodeExtractorImpl();

    // 首先尝试提取 Python 代码
    const pythonCodeMatch = formattedResponse.match(
      /```python\n([\s\S]*?)\n```/
    );
    if (pythonCodeMatch) {
      try {
        this.context.updatePreview({
          type: "python",
          content: pythonCodeMatch[1].trim(),
        });
        return; // 如果成功处理了 Python 代码，就直接返回
      } catch (error) {
        console.error("处理 Python 代码时出错:", error);
      }
    }

    // 如果没有 Python 代码或处理失败，尝试提取 HTML/CSS/JS
    const { htmlCode, cssCode, jsCode } = extractor.extract(formattedResponse);
    if (htmlCode || cssCode || jsCode) {
      try {
        const fullHtmlContent = extractor.generateHtmlContent(
          htmlCode,
          cssCode,
          jsCode
        );
        this.context.updatePreview({ type: "html", content: fullHtmlContent });
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
    this.context.updatePreview({ type: "html", content: fullHtmlContent });
  };

  private async simulateStreamResponse(content: string): Promise<void> {
    const chunkSize = Math.floor(Math.random() * 11) + 10; // 10-20之间的随机数
    let displayedContent = "";
    const messageId = uuidv4(); // 为整个流式响应生成一个唯一id

    // 先添加一个空的消息
    this.context.addChatMessage({
      id: messageId,
      text: "",
      sender: "bot",
      type: "markdown",
    });

    for (let i = 0; i < content.length; i += chunkSize) {
      const chunk = content.slice(i, i + chunkSize);
      displayedContent += chunk;
      await new Promise((resolve) => setTimeout(resolve, 50));

      // 更新消息内容
      this.context.updateMessages((prev) => {
        const newMessages = [...prev];
        const lastMessageIndex = newMessages.findIndex(
          (msg) => msg.id === messageId
        );
        if (lastMessageIndex !== -1) {
          newMessages[lastMessageIndex] = {
            ...newMessages[lastMessageIndex],
            text: displayedContent,
          };
        }
        return newMessages;
      });
    }
  }
}
