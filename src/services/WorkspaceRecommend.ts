import { WorkspaceStore } from "@/store/WorkspaceStore";
import { Message } from "@/types/apiTypes";
import ApiCommonParams from "@/utils/ApiCommonParams";
import { MessageCreator } from "@/utils/MessageCreator";
import { log } from "@/utils/log";
import Locales from "@/utils/Locales";
import { WorkspaceService } from "./WorkspaceService";
import { LocaleType } from "@/utils/Locales";
import { RouteRecommendTitles } from "@/types/routeApi";

export class WorkspaceRecommend {
  constructor(
    public store: WorkspaceStore,
    public locales: Locales<LocaleType, "/creator">,
    public workspaceService: WorkspaceService
  ) {}

  get aIApiScheduler() {
    return this.workspaceService.aiApiScheduler;
  }

  get state() {
    return this.store.state;
  }

  getRecommendedPrompt = (messages: Message[]) => {
    return messages.length === 0
      ? this.locales.get("prompt.recommend.keywords")
      : this.locales.format("prompt.recommend.keywords.hasMessages", {
          chatHistory: MessageCreator.toApiMessage(messages)
            .map((msg) => msg.content)
            .join("\n"),
        });
  };

  /**
   * 当message 为空时表示初始化提示词
   * @param messages
   */
  fetchNewRecommendedKeywords = async (messages: Message[]) => {
    try {
      const prompt = this.getRecommendedPrompt(messages);

      const aiApiParams = new ApiCommonParams({
        locales: this.locales,
        model: this.state.config.selectedModel,
        messages: [MessageCreator.createUserMessage(prompt)],
      });

      const response = await this.aIApiScheduler.getRecommendedKeywords(
        aiApiParams
      );
      if (response.keywords && response.keywords.length > 0) {
        this.store.updateRecommendedKeywords(response.keywords);
      } else {
        log.warn("未收到有效的关键词");
      }
    } catch (error) {
      log.error("获取推荐关键词失败:", error);
    }
  };

  initRecommendedKeywords() {
    // 如果推荐关键词为空, 则获取推荐关键词
    if (!this.state.config.recommendedKeywords.length) {
      this.fetchNewRecommendedKeywords([]);
    }
  }

  getRecommendedTitles = async (): Promise<string[]> => {
    // 如果没有聊天内容，则不推荐
    if (!this.store.hasMessages()) {
      return [];
    }

    const params = new ApiCommonParams({
      locales: this.locales,
      messages: this.store.state.chat.messages,
      model: this.store.state.config.selectedModel,
      coderPrompt: "locale:workspace.prompt.title.recommend",
    });

    const titles: RouteRecommendTitles["response"] =
      await this.workspaceService.getRecommendedTitles(params);

    return titles.titles;
  };
}
