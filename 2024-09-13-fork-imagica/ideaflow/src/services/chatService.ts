import React from 'react';
import { CodeExtractorImpl } from '../utils/CodeExtractor';

export interface Message {
  text: string;
  sender: "user" | "bot";
  type: "text" | "code" | "markdown";
}

export interface ChatHistory {
  role: string;
  content: string;
}

export class ChatController {
  constructor(
    private setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
    private setChatHistory: React.Dispatch<React.SetStateAction<ChatHistory[]>>,
    private setInput: React.Dispatch<React.SetStateAction<string>>,
    private setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    private onUpdatePreview: (content: string) => void
  ) {}

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
    const message = await this.getInput();  // 修改这里，使用 await
    if (!message.trim()) return;

    this.setIsLoading(true);
    const userMessage: ChatHistory = { role: "user", content: message };
    this.setMessages(prev => [...prev, { text: message, sender: "user", type: "text" }]);
    this.setChatHistory(prev => [...prev, userMessage]);

    try {
      const aiResponse = await this.callOpenAI(message, await this.getChatHistory());
      const formattedResponse = this.formatAIResponse(aiResponse);

      // 添加一个初始的空消息
      this.setMessages(prev => [...prev, { text: '', sender: "bot", type: "markdown" }]);

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
      this.setMessages(prev => [...prev, { text: "抱歉，发生了错误。", sender: "bot", type: "text" }]);
    } finally {
      this.setIsLoading(false);
      this.setInput("");
    }
  }

  public handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setInput(e.target.value);
  }

  public handleKeyPress = (e: React.KeyboardEvent<Element>): void => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.handleSubmit(e as any);
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

  // 添加这个新方法来获取当前输入值
  private async getInput(): Promise<string> {  // 修改返回类型为 Promise<string>
    return new Promise<string>(resolve => {
      this.setInput(currentInput => {
        resolve(currentInput);
        return currentInput;
      });
    });
  }

  private async simulateStreamResponse(content: string): Promise<void> {
    const chunkSize = Math.floor(Math.random() * 11) + 10; // 10-20之间的随机数
    let displayedContent = '';

    for (let i = 0; i < content.length; i += chunkSize) {
      const chunk = content.slice(i, i + chunkSize);
      displayedContent += chunk;
      await new Promise(resolve => setTimeout(resolve, 50));
      this.setMessages(prev => [
        ...prev.slice(0, -1),
        { ...prev[prev.length - 1], text: displayedContent }
      ]);
    }
  }
}