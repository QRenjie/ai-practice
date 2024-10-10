import { AiChatResponse, CodeBlock } from "@/types/apiTypes";
import { openAIClient } from "@/base/api/OpenAIClient";
import BackendApiScheduler from "./BackendApiScheduler";
import ApiCommonParams from "@/utils/ApiCommonParams";
import JSONUtil from "@/utils/JSONUtil";
import { WorkspaceState } from "@/types/workspace";

/**
 * 前端调用后台接口的中间层
 */
export default class AIApiScheduler {
  backendApi: BackendApiScheduler;

  // 新增参数，决定是否使用后端接口，默认前端直接发送请求
  constructor(public useBackend = true) {
    this.backendApi = new BackendApiScheduler();
  }

  /**
   * 调用 OpenAI 接口
   * @param apiParams
   * @returns
   */
  async callOpenAIStream(apiParams: ApiCommonParams): Promise<AiChatResponse> {
    try {
      if (this.useBackend) {
        // 通过next后台 /api/ai-response 接口
        const response = await this.backendApi.callOpenAIStream(apiParams);

        console.log("response from backend", response);
        return response;
      } else {
        const response = await openAIClient.generateCode(apiParams);

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
      body: JSONUtil.stringify(codeBlock),
    }).then((response) => response.json());
  }

  /**
   * 获取推荐关键词
   * @param apiParams
   * @returns
   */
  async getRecommendedKeywords(
    apiParams: ApiCommonParams
  ): Promise<{ keywords: string[] }> {
    try {
      if (this.useBackend) {
        // 通过next后台 /api/ai-response 接口
        const response = await this.backendApi.getRecommendedKeywords(
          apiParams
        );

        console.log("response from backend", response);
        return response;
      } else {
        const result = await openAIClient.generateKeywords(apiParams);
        console.log("response from openAIClient", result);

        return result;
      }
    } catch (error) {
      throw error;
    }
  }

  // 修改 buildPreview 方法
  async buildPreview(state: WorkspaceState["code"]): Promise<Response> {
    const response = await this.backendApi.buildPreview(state);

    if (!response.ok) {
      throw new Error("构建失败");
    }

    return response;
  }

  // 修改 getFileNameFromResponse 方法
  getFileNameFromResponse(response: Response): string {
    const contentDisposition = response.headers.get("Content-Disposition");
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/i);
      if (fileNameMatch) {
        return fileNameMatch[1];
      }
    }
    return "build.zip";
  }

  async saveWorkspace(state: WorkspaceState): Promise<boolean> {
    try {
      await this.backendApi.saveWorkspace(state);

      return true;
    } catch (error) {
      console.error("保存工作区时出错:", error);
      return false;
    }
  }

  async getWorkspaces(params: { public?: boolean }): Promise<WorkspaceState[]> {
    return this.backendApi.getWorkspaces(params);
  }
}

export const aiApiScheduler = new AIApiScheduler();
