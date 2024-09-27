import { AiChatResponse, Message } from "@/types/apiTypes";
import ApiClient from "./ApiClient";
import { CodeExtractor } from "./CodeExtractor";
import { OpenAIError } from "./KeywordGenerator";

const baseChatMessage: Message[] = [
  {
    role: "user",
    content:
      "你是前端开发者, 如果你回答的是html代码, 则将css, html, javascript 代码放在一个文件中",
    id: "",
    type: "text",
  },
];

const baseKeywordMessage: Message[] = [
  {
    role: "user",
    content:
      "你是一个帮助生成相关关键词的AI助手。你是一个可以通过用户对话推测用户可能会说的下一句是什么非常智能的ai, 下面是用户和AI对话的内容，请生成 4 - 6个相关的关键词、短语或后续问题。这些内容应该是用户可能想要进一步了解或讨论的主题。每行一个，不要有编号或其他格式",
    id: "",
    type: "text",
  },
];

class OpenAIClient extends ApiClient {
  defualtModel = "gpt-3.5-turbo";

  async chat({
    model,
    history,
    message,
  }: {
    model?: string;
    message: string;
    history?: Message[];
  }): Promise<AiChatResponse> {
    history = [...baseChatMessage, ...(history || [])];

    try {
      const result = await this.postStream("/chat/completions", {
        model: model || this.defualtModel,
        messages: [...history, { role: "user", content: message }],
        stream: true,
      });

      if (!result || !result.content) {
        throw new Error("无效的响应数据");
      }

      return {
        ...result,
        codeBlocks: CodeExtractor.extract(result.content),
      } as AiChatResponse;
    } catch (error) {
      console.error("Chat 请求出错:", error);
      throw error;
    }
  }

  async generateKeywords({
    model,
    messages,
  }: {
    model?: string;
    messages: Message[];
  }): Promise<{ keywords: string[] }> {
    try {
      const result = await this.postStream("/chat/completions", {
        model: model || this.defualtModel,
        messages: [...baseKeywordMessage, ...(messages || [])],
        stream: true,
      });

      const keywords = result.content
        .split("\n")
        .map((keyword) => keyword.trim())
        .filter(Boolean);

      return {
        keywords: keywords.slice(0, 6),
      };
    } catch (error) {
      const openAIError = error as OpenAIError;
      console.error("OpenAI API错误:", openAIError);
      // if (retries > 0 && openAIError.response?.status === 409) {
      //   console.log(`重试生成关键词，剩余尝试次数: ${retries - 1}`);
      //   await new Promise((resolve) => setTimeout(resolve, 1000));
      //   return this.generateKeywords(chatHistory, language, retries - 1);
      // }
      throw openAIError;
    }
  }
}

// 创建OpenAI API客户端实例
const openAIClient = new OpenAIClient(
  "http://openai-proxy.brain.loocaa.com/v1"
);
// 如果有token，可以在这里设置
openAIClient.setAuthToken("DlJYSkMVj1x4zoe8jZnjvxfHG6z5yGxK");

export { ApiClient, openAIClient };
