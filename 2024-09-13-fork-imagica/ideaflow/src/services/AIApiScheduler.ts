import { AiChatResponse, ApiMessage, CodeBlock } from "@/types/apiTypes";
import { openAIClient } from "@/base/api/OpenAIClient";
import BackendApiScheduler from "./BackendApiScheduler";

/**
 * 前端调用后台接口的中间层
 */
export default class AIApiScheduler {
  backendApi: BackendApiScheduler;

  // 新增参数，决定是否使用后端接口，默认前端直接发送请求
  constructor(public useBackend = true) {
    this.backendApi = new BackendApiScheduler();
  }

  // 新增使用流式请求的方法
  async callOpenAIStream(
    message: string,
    messages: ApiMessage[]
  ): Promise<AiChatResponse> {
    const params = {
      message,
      history: messages,
    };
    try {
      if (this.useBackend) {
        // 通过next后台 /api/ai-response 接口
        const response = await this.backendApi.callOpenAIStream(params);

        console.log("response from backend", response);
        return response;
      } else {
        const response = await openAIClient.generateCode(params);

        console.log("response from openAIClient", response);
        return response;
      }
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
      const params = {
        // 只保存最后20条
        messages: messages.slice(0, 20),
      };
      if (this.useBackend) {
        // 通过next后台 /api/ai-response 接口
        const response = await this.backendApi.getRecommendedKeywords(params);

        console.log("response from backend", response);
        return response;
      } else {
        const result = await openAIClient.generateKeywords(params);
        console.log("response from openAIClient", result);

        return result;
      }
    } catch (error) {
      throw error;
    }
  }

  // 新增 renderTSX 方法
  async renderTSX(codeBlock: CodeBlock): Promise<{content: string}> {
    try {
      const response = await fetch("/api/render", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(codeBlock),
      });
      if (!response.ok) {
        throw new Error("网络响应不正常");
      }
      const result = await response.json();

      console.log("renderTSX result", result);
      
      return result;
    } catch (error) {
      console.error("渲染 TSX 错误:", error);
      throw error;
    }
  }
}
