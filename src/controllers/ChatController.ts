import { WorkspaceController } from "@/controllers/WorkspaceController";
import { RefObject } from "react";
import { AiChatResponse, CodeBlock, Message } from "@/types/apiTypes";
import { CodeBlocks } from "@/utils/CodeBlocks";
import AIApiScheduler, { aiApiScheduler } from "@/services/AIApiScheduler";
import { SandpackFile } from "@codesandbox/sandpack-react";
import sandpackFile from "config/sandpackFile";
import ApiCommonParams from "@/utils/ApiCommonParams";
import { cloneDeep } from "lodash-es";
import { log } from "@/utils/log";
import { MessageCreator } from "@/utils/MessageCreator";
import { ChatSubmiter } from "@/services/ChatSubmiter";
import { ChatApply } from "@/services/ChatApply";

export type ApplyData = { type: "html" | "python"; content: string };

export class ChatController {
  private inputRef: RefObject<HTMLTextAreaElement> | null = null;
  aIApiScheduler: AIApiScheduler;
  chatSubmiter: ChatSubmiter;
  chatApply: ChatApply;

  constructor(
    public workspaceController: WorkspaceController,
    private setIsLoading: (isLoading: boolean) => void
  ) {
    this.aIApiScheduler = aiApiScheduler;
    this.chatSubmiter = new ChatSubmiter(
      this.aIApiScheduler,
      this.workspaceController
    );
    this.chatApply = new ChatApply(this.workspaceController);
  }

  setInputRef(ref: RefObject<HTMLTextAreaElement>) {
    this.inputRef = ref;
  }

  get state() {
    return this.workspaceController.getState();
  }

  get chatMessages() {
    return this.state.chat.messages;
  }

  private async submit(message: string): Promise<void> {
    // 创建一个新的对话数据数据, 并新增用户消息
    const userMessage = MessageCreator.createUserMessage(message);
    this.workspaceController.store.addChatMessage(userMessage);

    const newMessage = await this.chatSubmiter.submit(userMessage);

    // 新增AI消息
    this.workspaceController.store.addChatMessage(newMessage);
    // 应用消息
    await this.reapplyAiMessage(newMessage);

    // 获取新的推荐关键词
    if (this.chatMessages.length >= 1) {
      this.fetchNewRecommendedKeywords([...this.chatMessages, newMessage]);
    }
  }

  public async handleSubmit(): Promise<void> {
    const message = this.inputRef?.current?.value || "";
    if (!message.trim()) return;

    this.setIsLoading(true);
    try {
      await this.submit(message);
    } catch (error) {
      log.error("handleSubmit error", error);
      const errorMessage = MessageCreator.createErrorMessage(error);
      this.workspaceController.store.addChatMessage(errorMessage);
    } finally {
      this.setIsLoading(false);
      if (this.inputRef?.current) {
        this.inputRef.current.value = "";
      }
    }
  }

  public handleKeyPress = (e: React.KeyboardEvent<Element>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      this.handleSubmit();
    }
  };

  public handleCopy = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      log.error("无法复制文本: ", err);
    }
  };

  /**
   * 重新应用消息
   * @param message
   */
  public reapplyAiMessage = async (message: Message): Promise<void> => {
    return this.chatApply.apply(message);
  };

  /**
   * 当message 为空时表示初始化提示词
   * @param messages
   */
  fetchNewRecommendedKeywords = async (messages: Message[]) => {
    try {
      const prompt =
        messages.length === 0
          ? this.workspaceController.locales.get("prompt.recommend.keywords")
          : this.workspaceController.locales.format(
              "prompt.recommend.keywords.hasMessages",
              {
                chatHistory: MessageCreator.toApiMessage(messages)
                  .map((msg) => msg.content)
                  .join("\n"),
              }
            );

      const aiApiParams = new ApiCommonParams({
        locales: this.workspaceController.locales,
        model: this.state.config.selectedModel,
        messages: [MessageCreator.createUserMessage(prompt)],
      });

      const response = await this.aIApiScheduler.getRecommendedKeywords(
        aiApiParams
      );
      if (response.keywords && response.keywords.length > 0) {
        this.workspaceController.store.updateRecommendedKeywords(
          response.keywords
        );
      } else {
        log.warn("未收到有效的关键词");
      }
    } catch (error) {
      log.error("获取推荐关键词失败:", error);
    }
  };

  initRecommendedKeywords() {
    // 如果推荐关键词为空, 则获取推荐关键词
    if (
      !this.workspaceController.store.state.config.recommendedKeywords.length
    ) {
      this.fetchNewRecommendedKeywords([]);
    }
  }
}
