import { AiChatResponse, CodeBlock, Message } from "@/types/apiTypes";
import { openAIClient } from "@/utils/ServerClient";
import { pick } from "lodash-es";

export default class AIService {
  // 新增使用流式请求的方法
  async callOpenAIStream(
    message: string,
    messages: Message[]
  ): Promise<AiChatResponse> {
    try {
      const response = await openAIClient.chat({
        model: "gpt-3.5-turbo",
        message,
        history: messages.map(message => pick(message, ['role', 'content'])),
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
    messages: Message[]
  ): Promise<{ keywords: string[] }> {
    try {
      const result = await openAIClient.generateKeywords({
        messages: messages.map(message => pick(message, ['role', 'content'])).slice(0, 20),
      });
      console.log("result", result);

      return result;
    } catch (error) {
      throw error;
    }
  }
}
