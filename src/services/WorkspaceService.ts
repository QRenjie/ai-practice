import { WorkspaceState } from "@/types/workspace";
import AIApiScheduler, { aiApiScheduler } from "./AIApiScheduler";
import ApiCommonParams from "@/utils/ApiCommonParams";
// 引入 PromiseQueue
import PromiseQueue from "@/utils/PromiseQueue";

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
}

export const workspaceService = new WorkspaceService(aiApiScheduler);
