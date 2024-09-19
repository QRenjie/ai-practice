import React from 'react';
import { CodeExtractorImpl } from '../utils/CodeExtractor';
import { v4 as uuidv4 } from 'uuid';  // 需要安装 uuid 包

export interface Message {
  id: string; // 现在id是必需的
  text: string;
  sender: "user" | "bot";
  type: "text" | "code" | "markdown";
}

export interface ChatHistory {
  role: string;
  content: string;
}

export class ChatController {
  private inputRef: React.RefObject<HTMLInputElement>;

  constructor(
    private setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    private setChatHistory: React.Dispatch<React.SetStateAction<ChatHistory[]>>,
    private setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    private onUpdatePreview: (content: string) => void,
    inputRef: React.RefObject<HTMLInputElement>
  ) {
    this.inputRef = inputRef;
  }

  private async callOpenAI(message: string, history: ChatHistory[]): Promise<string> {
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
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP错误！状态：${response.status}`);
    }

    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
      throw new Error("OpenAI API的响应结构异常");
    }

    return data.choices[0].message.content;
  }

  private formatAIResponse(response: string): string {
    // 移除首尾的空白字符
    const trimmedResponse = response.trim();

    // 检查是否整个响应都是一个HTML字符串
    if (trimmedResponse.startsWith('<') &&
      trimmedResponse.endsWith('>') &&
      !trimmedResponse.includes('\n') &&
      !trimmedResponse.includes('```')) {
      // 如果是单行HTML且不包含Markdown代码块，则将其包装在HTML代码块中
      return `\`\`\`html\n${trimmedResponse}\n\`\`\``;
    }

    // 如果不是，就保持原样返回，因为它可能已经是正确格式的Markdown
    return response;
  }

  public async handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    const message = this.getInputValue();
    if (!message.trim()) return;

    this.setIsLoading(true);
    const userMessage: ChatHistory = { role: "user", content: message };
    this.setMessages(prev => [...prev, { id: uuidv4(), text: message, sender: "user", type: "text" }]);
    this.setChatHistory(prev => [...prev, userMessage]);

    try {
      const aiResponse = await this.callOpenAI(message, await this.getChatHistory());
      const formattedResponse = this.formatAIResponse(aiResponse);

      // 添加一个初始的空消息，但现在包含id
      this.setMessages(prev => [...prev, { id: uuidv4(), text: '', sender: "bot", type: "markdown" }]);

      // 模拟流式响应显示
      await this.simulateStreamResponse(formattedResponse);

      const botMessage: ChatHistory = { role: "assistant", content: formattedResponse };
      this.setChatHistory(prev => [...prev, userMessage, botMessage]);

      const extractor = new CodeExtractorImpl();
      const { htmlCode, cssCode, jsCode } = extractor.extract(formattedResponse);
      const fullHtmlContent = extractor.generateHtmlContent(htmlCode, cssCode, jsCode);

      this.onUpdatePreview(fullHtmlContent);
    } catch (error) {
      console.error("错误:", error);
      this.setMessages(prev => [...prev, { id: uuidv4(), text: "抱歉，发生了错误。", sender: "bot", type: "text" }]);
    } finally {
      this.setIsLoading(false);
      this.clearInput();
    }
  }

  private getInputValue(): string {
    return this.inputRef.current?.value || '';
  }

  private clearInput(): void {
    if (this.inputRef.current) {
      this.inputRef.current.value = '';
    }
  }

  public handleKeyPress = (e: React.KeyboardEvent<Element>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.handleSubmit(e as React.KeyboardEvent<Element>);
    }
  }

  public copyToClipboard = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      // 可以在这里显示"已复制！"消息
    } catch (err) {
      console.error("无法复制文本: ", err);
    }
  }

  public handleReapplyCode = (code: string): void => {
    const extractor = new CodeExtractorImpl();
    const { htmlCode, cssCode, jsCode } = extractor.extract(code);
    const fullHtmlContent = extractor.generateHtmlContent(htmlCode, cssCode, jsCode);
    this.onUpdatePreview(fullHtmlContent);
  }

  private getChatHistory = async (): Promise<ChatHistory[]> => {
    return new Promise(resolve => {
      this.setChatHistory(history => {
        resolve(history);
        return history;
      });
    });
  }

  public updatePreviewCallback(newCallback: (content: string) => void): void {
    this.onUpdatePreview = newCallback;
  }

  private async simulateStreamResponse(content: string): Promise<void> {
    const chunkSize = Math.floor(Math.random() * 11) + 10; // 10-20之间的随机数
    let displayedContent = '';
    const messageId = uuidv4();  // 为整个流式响应生成一个唯一id

    for (let i = 0; i < content.length; i += chunkSize) {
      const chunk = content.slice(i, i + chunkSize);
      displayedContent += chunk;
      await new Promise(resolve => setTimeout(resolve, 50));
      this.setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          ...newMessages[newMessages.length - 1],
          id: messageId,  // 使用同一个id
          text: displayedContent
        };
        return newMessages;
      });
    }
  }
}