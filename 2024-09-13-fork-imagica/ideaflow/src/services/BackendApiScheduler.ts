import { WorkspaceState } from "@/types/workspace";
import { AiChatResponse, CodeBlock } from "@/types/apiTypes";
import ApiCommonParams from "@/utils/ApiCommonParams";
import JSONUtil from "@/utils/JSONUtil";

/**
 * 调用 Next.js 后台接口的实现类
 */
export default class BackendApiScheduler {
  async callOpenAIStream(params: ApiCommonParams): Promise<AiChatResponse> {
    try {
      const response = await fetch("/api/ai-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSONUtil.stringify(params),
      }).then((res) => res.json());

      console.log("response from backend", response);
      return response;
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

  async getRecommendedKeywords(
    params: ApiCommonParams
  ): Promise<{ keywords: string[] }> {
    try {
      const result = await fetch("/api/recommended-keywords", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSONUtil.stringify(params),
      }).then((res) => res.json());

      console.log("result", result);
      return result;
    } catch (error) {
      console.error("获取关键词错误:", error);
      throw error;
    }
  }

  /**
   * 构建工作区
   * @param state
   * @returns
   */
  async buildPreview(state: WorkspaceState["code"]): Promise<Response> {
    return fetch("/api/build-preview", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSONUtil.stringify(state),
    });
  }

  /**
   * 保存工作区
   * @param state
   * @returns
   */
  async saveWorkspace(state: WorkspaceState): Promise<void> {
    return fetch("/api/save-workspace", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSONUtil.stringify(state),
    }).then((res) => res.json());
  }

  async getWorkspaces(params: {
    type?: "public" | "my" | "all";
  }): Promise<WorkspaceState[]> {
    const searchParams = `?type=${params.type}`;

    return fetch(`/api/get-workspaces${searchParams}`).then((res) =>
      res.json()
    );
  }
}
