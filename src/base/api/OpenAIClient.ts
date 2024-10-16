import { AiChatResponse, ApiMessage } from "@/types/apiTypes";
import ApiClient from "./ApiClient";
import { CodeExtractor } from "@/utils/CodeExtractor";
import models from "config/models.json";
import ApiCommonParams from "@/utils/ApiCommonParams";
import { RouteRecommendTitles } from "@/types/routeApi";

export interface OpenAIError extends Error {
  response?: {
    status: number;
  };
}

export interface OpenAIChatParmas {
  model?: string;
  message: string;
  history?: ApiMessage[];
}

export interface OpenAIGenerateKeysParams {
  messages: ApiMessage[];
}
class OpenAIClient extends ApiClient {
  defualtModel = models.turbo;

  // 生成代码的对话
  async generateCode(
    apiCommonParams: ApiCommonParams
  ): Promise<AiChatResponse> {
    try {
      const result = await this.postStream("/chat/completions", {
        model: apiCommonParams.model,
        messages: apiCommonParams.messages,
        stream: apiCommonParams.stream,
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

  async generateKeywords(
    apiParams: ApiCommonParams
  ): Promise<{ keywords: string[] }> {
    try {
      const result = await this.postStream("/chat/completions", {
        model: apiParams.model,
        // 只取最后20条, 减少token消耗
        messages: apiParams.messages.slice(0, 20),
        stream: apiParams.stream,
      });

      const keywords = result.content
        .split("\n")
        .map((keyword) => keyword.trim())
        .filter(Boolean);

      return {
        keywords: keywords.slice(0, 10),
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

  async generateTitles(
    apiParams: ApiCommonParams
  ): Promise<RouteRecommendTitles["response"]> {
    try {
      const result = await this.postStream("/chat/completions", {
        model: apiParams.model,
        messages: apiParams.messages,
        stream: apiParams.stream,
      });

      const titles = result.content
        .split("\n")
        .map((title) => title.trim())
        .filter(Boolean);

      return {
        titles: titles.slice(0, 10),
      };
    } catch (error) {
      const openAIError = error as OpenAIError;
      console.error("OpenAI API错误:", openAIError);
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
