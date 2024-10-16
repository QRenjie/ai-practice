import { WorkspaceState } from "@/types/workspace";
import AIApiScheduler, { aiApiScheduler } from "./AIApiScheduler";
import ApiCommonParams from "@/utils/ApiCommonParams";
import { WorkspaceEncrypt } from "@/utils/WorkspaceEncrypt";
import { Uid } from "@/utils/Uid";
import { RouteSaveWorkspace } from "@/types/routeApi";

export class WorkspaceService {
  constructor(public readonly aiApiScheduler: AIApiScheduler) {}

  async getRecommendedTitles(params: ApiCommonParams) {
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
  ): Promise<{ previewId: string; encryptedContent: string }> {
    const previewId = Uid.generate();
    const encryptedContent = WorkspaceEncrypt.encrypt(workspaceState);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 返回包含加密内容的 URL
    return { previewId, encryptedContent };
  }
}

export const workspaceService = new WorkspaceService(aiApiScheduler);
