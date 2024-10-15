import { WorkspaceService } from "@/services/WorkspaceService";
import ApiCommonParams from "@/utils/ApiCommonParams";
import { WorkspaceStore } from "@/store/WorkspaceStore";
import { WorkspaceState } from "@/types/workspace";
import { FileDownloader } from "@/utils/ui/FileDownloader";

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
    const result = await this.workspaceService.save(state);

    // 如果当前没有保存过的项目,将路由地址跳转过去

    return result;
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

  async exportProject(state: WorkspaceState["code"]) {
    const { blob, fileName } = await this.workspaceService.exportProject(state);

    FileDownloader.downloadFile(blob, fileName);
  }

  async publish(workspaceState: WorkspaceState): Promise<{
    previewId: string;
    encryptedContent: string;
    url: string;
  }> {
    const { previewId, encryptedContent } = await this.workspaceService.publish(
      workspaceState
    );

    const url = `/preview/${previewId}?data=${encryptedContent}`;

    return { previewId, encryptedContent, url };
  }
}
