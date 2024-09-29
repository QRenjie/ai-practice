import { AiChatResponse, ApiMessage, Message } from "@/types/apiTypes";
import ApiClient from "./ApiClient";
import { CodeExtractor } from "./CodeExtractor";
import { OpenAIError } from "./KeywordGenerator";
import models from "@/config/models";
import { prompts } from "@/config/prompts";

const baseChatMessage: ApiMessage[] = [
  {
    role: "system",
    content: prompts.coder,
  },
];

const baseKeywordMessage: ApiMessage[] = [
  {
    role: "system",
    content: prompts.recommonder,
  },
];

class OpenAIClient extends ApiClient {
  defualtModel = models.turbo;

  async chat({
    model,
    history,
    message,
  }: {
    model?: string;
    message: string;
    history?: ApiMessage[];
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
    messages,
  }: {
    messages: ApiMessage[];
  }): Promise<{ keywords: string[] }> {
    try {
      const result = await this.postStream("/chat/completions", {
        model: models.gpt4,
        messages: messages,
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
