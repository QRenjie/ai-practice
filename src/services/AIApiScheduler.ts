import { AiChatResponse, CodeBlock } from "@/types/apiTypes";
import { openAIClient } from "@/base/api/OpenAIClient";
import BackendApiScheduler from "./BackendApiScheduler";
import ApiCommonParams from "@/utils/ApiCommonParams";
import JSONUtil from "@/utils/JSONUtil";
import { WorkspaceState } from "@/types/workspace";
import { AiApiExecutor } from "./AiApiExecutor";
import { RouteSaveWorkspace } from "@/types/routeApi";

/**
 * 前端调用后台接口的中间层
 */
export default class AIApiScheduler {
  backendApi: BackendApiScheduler;
  aiApiExecutor: AiApiExecutor;

  // 新增参数，决定是否使用后端接口，默认前端直接发送请求
  constructor(public useBackend = true) {
    this.backendApi = new BackendApiScheduler();
    this.aiApiExecutor = new AiApiExecutor();
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
    return this.aiApiExecutor.exec(() => this.backendApi.buildPreview(state));
  }

  async saveWorkspace(state: WorkspaceState): Promise<RouteSaveWorkspace["response"]> {
    return this.aiApiExecutor.exec(() => this.backendApi.saveWorkspace(state));
  }

  async getWorkspaces(params: {
    type?: "public" | "my" | "all";
  }): Promise<WorkspaceState[]> {
    return this.backendApi.getWorkspaces(params);
  }

  async getRecommendedTitles(
    params: ApiCommonParams
  ): Promise<{ titles: string[] }> {
    if (this.useBackend) {
      return this.backendApi.getRecommendedTitles(params);
    } else {
      return openAIClient.generateTitles(params);
    }
  }
}

export const aiApiScheduler = new AIApiScheduler();
