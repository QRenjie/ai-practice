import { WorkspaceState } from "@/types/workspace";
import AIApiScheduler, { aiApiScheduler } from "./AIApiScheduler";
import ApiCommonParams from "@/utils/ApiCommonParams";
import PromiseQueue from "@/utils/PromiseQueue";
import { WorkspaceEncrypt } from "@/utils/WorkspaceEncrypt";
import { Uid } from "@/utils/Uid";

export class WorkspaceService {
  constructor(public readonly aiApiScheduler: AIApiScheduler) {}

  // 创建 PromiseQueue 实例
  private saveQueue = new PromiseQueue();

  async getRecommendedTitles(params: ApiCommonParams) {
    return this.aiApiScheduler.getRecommendedTitles(params);
  }

  async save(state: WorkspaceState): Promise<void> {
    // 使用 PromiseQueue 控制 save 方法
    return this.saveQueue.add(() => this.performSave(state));
  }

  private async performSave(state: WorkspaceState): Promise<void> {
    try {
      const success = await aiApiScheduler.saveWorkspace(state);

      if (!success) {
        throw new Error("保存失败");
      }
    } catch (error) {
      console.error("保存工作区时出错:", error);
      throw error;
    }
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
