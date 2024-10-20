import { WorkspaceService } from "@/services/WorkspaceService";
import { WorkspaceStore } from "@/store/WorkspaceStore";
import { WorkspaceState } from "@/types/workspace";
import { FileDownloader } from "@/utils/ui/FileDownloader";
import Locales, { LocaleType } from "@/utils/Locales";
import { RoutePublish } from "@/types/routeApi";
import { log } from "@/utils/log";
import { WorkspaceRecommend } from "@/services/WorkspaceRecommend";

export class WorkspaceController {
  workspaceRecommend: WorkspaceRecommend;

  constructor(
    public store: WorkspaceStore,
    public workspaceService: WorkspaceService,
    public locales: Locales<LocaleType, "/creator">
  ) {
    this.workspaceRecommend = new WorkspaceRecommend(
      store,
      locales,
      workspaceService
    );
  }

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
      log.error("保存工作区时出错:", error);
    }
  };

  async save() {
    const state = await this.store.getState();
    const result = await this.workspaceService.save(state);

    // 如果当前没有保存过的项目,将路由地址跳转过去
    if (result.success && result.workspaceKey) {
      // 使用 replaceState 替换当前历史记录条目
      window.history.replaceState(null, "", `/creator/${result.workspaceKey}`);
    }

    return result;
  }

  getRecommendedTitles = async (): Promise<string[]> => {
    return this.workspaceRecommend.getRecommendedTitles();
  };

  async exportProject(state: WorkspaceState["code"]) {
    const { blob, fileName } = await this.workspaceService.exportProject(state);

    FileDownloader.downloadFile(blob, fileName);
  }

  async publish(
    workspaceState: WorkspaceState
  ): Promise<RoutePublish["response"] & { url: string }> {
    const response = await this.workspaceService.publish(workspaceState);

    const url = `/preview/${response.publishKey}`;

    return { ...response, url };
  }
}
