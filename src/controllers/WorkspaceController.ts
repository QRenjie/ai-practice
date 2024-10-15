import { WorkspaceService } from "@/services/WorkspaceService";
import ApiCommonParams from "@/utils/ApiCommonParams";
import { WorkspaceStore } from "@/store/WorkspaceStore";
import { WorkspaceState } from "@/types/workspace";

export class WorkspaceController {
  constructor(
    public store: WorkspaceStore,
    public workspaceService: WorkspaceService
  ) {}

  getState = () => {
    return this.store.state;
  };

  updateMeta = (meta: Partial<WorkspaceState["meta"]>) => {
    this.store.updateMeta(meta);
    this.saveNoCatch();
  };

  updateTitle = (title: string) => {
    this.store.updateTitle(title);
    this.saveNoCatch();
  };

  saveNoCatch = async () => {
    try {
      await this.save();
    } catch (error) {
      console.error("保存工作区时出错:", error);
      throw error;
    }
  };

  async save() {
    const state = await this.store.getState();
    return this.workspaceService.save(state);
  }

  getRecommendedTitles = async (): Promise<string[]> => {
    const params = new ApiCommonParams({
      messages: this.store.state.chat.messages,
      model: this.store.state.config.selectedModel,
      coderPrompt: "locale:workspace.prompt.title.recommend",
    });

    // 如果没有聊天内容，则不推荐
    if (!this.store.hasMessages()) {
      return [];
    }

    const titles = await this.workspaceService.getRecommendedTitles(params);

    return titles.titles;
  };
}
