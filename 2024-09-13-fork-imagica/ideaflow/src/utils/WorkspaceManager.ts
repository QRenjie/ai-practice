import { WorkspaceState } from "@/context/WorkspaceContext";
import { aiApiScheduler } from "@/services/AIApiScheduler";

export class WorkspaceManager {
  async save(state: WorkspaceState): Promise<void> {
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

export const workspaceManager = new WorkspaceManager();