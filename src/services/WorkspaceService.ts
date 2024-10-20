import { WorkspaceState } from "@/types/workspace";
import AIApiScheduler, { aiApiScheduler } from "./AIApiScheduler";
import ApiCommonParams from "@/utils/ApiCommonParams";
import {
  RoutePublish,
  RouteRecommendTitles,
  RouteSaveWorkspace,
} from "@/types/routeApi";

export class WorkspaceService {
  constructor(public readonly aiApiScheduler: AIApiScheduler) {}

  async getRecommendedTitles(
    params: ApiCommonParams
  ): Promise<RouteRecommendTitles["response"]> {
    return this.aiApiScheduler.getRecommendedTitles(params);
  }

  save(state: WorkspaceState): Promise<RouteSaveWorkspace["response"]> {
    return this.aiApiScheduler.saveWorkspace(state);
  }

  async exportProject(
    state: WorkspaceState["code"]
  ): Promise<{ blob: Blob; fileName: string }> {
    const response = await this.aiApiScheduler.buildPreview(state);

    const blob = await response.blob();
    const fileName = this.getFileNameFromResponse(response);

    return { blob, fileName };
  }
  // 修改 getFileNameFromResponse 方法
  private getFileNameFromResponse(response: Response): string {
    const contentDisposition = response.headers.get("Content-Disposition");
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/i);
      if (fileNameMatch) {
        return fileNameMatch[1];
      }
    }
    return "build.zip";
  }

  async publish(
    workspaceState: WorkspaceState
  ): Promise<RoutePublish["response"]> {
    return this.aiApiScheduler.publishWorkspace(workspaceState);
  }
}

export const workspaceService = new WorkspaceService(aiApiScheduler);
