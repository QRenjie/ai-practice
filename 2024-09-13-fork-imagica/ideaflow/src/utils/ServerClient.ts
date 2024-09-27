import { Message } from "@/types/apiTypes";
import ApiClient from "./ApiClient";
import { AxiosResponse } from "axios";

class OpenAIClient extends ApiClient {
  defualtModel = "gpt-3.5-turbo";
  chat({
    model,
    history,
    message,
  }: {
    model?: string;
    message: string;
    history?: Message[];
  }): Promise<AxiosResponse> {
    return openAIClient.postStream("/chat/completions", {
      model: model || this.defualtModel,
      messages: history
        ? [...history, { role: "user", content: message }]
        : [{ role: "user", content: message }],
      stream: true,
    });
  }

  async generateKeywords({ model, prompt }: { model?: string; prompt: string }) {
    try {
      const response = await this.postStream("/chat/completions", {
        model: model || this.defualtModel,
        messages: [
          { role: "system", content: "你是一个帮助生成相关关键词的AI助手。" },
          { role: "user", content: prompt },
        ],
        stream: true,
      });
      return response;
    } catch (error) {
      console.error("生成关键词时发生错误:", error);
      throw error;
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
