import {
  AiChatResponse,
  ApiMessage,
  CodeBlock,
  Message,
} from "@/types/apiTypes";
import { openAIClient } from "@/utils/ServerClient";
import { pick } from "lodash-es";
import models from '../config/models';

export default class AIService {
  // 新增使用流式请求的方法
  async callOpenAIStream(
    message: string,
    messages: ApiMessage[]
  ): Promise<AiChatResponse> {
    try {
      const selectedModel = models["turbo"]; // 使用映射对象中的键来引用模型
      const response = await openAIClient.chat({
        model: selectedModel,
        message,
        history: messages,
      });

      console.log("response", response);
      return response;

      // const response = await fetch("/api/ai-response", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     message,
      //     history,
      //   }),
      // });

      // if (!response.ok) {
      //   throw new Error(`HTTP错误！状态：${response.status}`);
      // }

      // const data = await response.json();
      // if (data.error) {
      //   throw new Error(data.error);
      // }

      // return data;
    } catch (error) {
      console.error("AI响应错误:", error);
      throw error;
    }
  }

  async execPythonCode(codeBlock: CodeBlock) {
    // 调用后端 API 处理 Python 代码
    return fetch("/api/code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(codeBlock),
    }).then((response) => response.json());
  }

  async getRecommendedKeywords(
    messages: ApiMessage[]
  ): Promise<{ keywords: string[] }> {
    try {
      const result = await openAIClient.generateKeywords({
        messages: messages.slice(0, 20),
      });
      console.log("result", result);

      return result;
    } catch (error) {
      throw error;
    }
  }
}
