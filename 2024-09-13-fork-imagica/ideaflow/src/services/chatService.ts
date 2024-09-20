import React from "react";
import { CodeExtractorImpl } from "../utils/CodeExtractor";
import { v4 as uuidv4 } from "uuid";
import { RefObject } from 'react';
import { WorkspaceState } from "@/context/WorkspaceContext";

export interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  type: "text" | "code" | "markdown";
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

  // 备份原有的 callOpenAI 方法
  private async callOpenAIOriginal(
    message: string,
    history: ChatHistory[]
  ): Promise<string> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时

      const response = await fetch(
        "http://openai-proxy.brain.loocaa.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer DlJYSkMVj1x4zoe8jZnjvxfHG6z5yGxK",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [...history, { role: "user", content: message }],
          }),
          signal: controller.signal
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP错误！状态：${response.status}`);
      }

      // 读取原始响应文本
      const rawText = await response.text();

      // 尝试解析 JSON
      let data;
      try {
        data = JSON.parse(rawText);
      } catch (error) {
        throw new Error('无法解析服务器响应');
      }

      if (!data.choices?.[0]?.message?.content) {
        throw new Error("OpenAI API的响应结构异常");
      }

      return data.choices[0].message.content;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('请求超时，请稍后重试');
      }
      throw error; // 重新抛出错误,以便上层函数可以处理
    }
  }

  // 新增使用流式请求的方法
  private async callOpenAIStream(
    message: string,
    history: ChatHistory[]
  ): Promise<string> {
    try {
      const response = await fetch(
        "http://openai-proxy.brain.loocaa.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer DlJYSkMVj1x4zoe8jZnjvxfHG6z5yGxK",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [...history, { role: "user", content: message }],
            stream: true, // 启用流式响应
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP错误！状态：${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder("utf-8");
      let fullResponse = "";
      const messageId = uuidv4(); // 为整个流式响应生成一个唯一id

      // 先添加一个空的消息
      this.addChatMessage({ id: messageId, text: "", sender: "bot", type: "markdown" });

      while (true) {
        const { done, value } = await reader?.read() || { done: true, value: undefined };
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim() !== '');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              return fullResponse; // 添加这行来正确结束流
            }
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content || '';
              fullResponse += content;
              this.updateMessage(messageId, fullResponse);
            } catch (error) {
              console.error('解析错误:', error);
            }
          }
        }
      }

      return fullResponse;
    } catch (error) {
      console.error('流处理错误:', error);
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

      const formattedResponse = this.formatAIResponse(aiResponse);

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
