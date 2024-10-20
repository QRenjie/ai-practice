import { WorkspaceController } from "@/controllers/WorkspaceController";
import { RefObject } from "react";
import { Message } from "@/types/apiTypes";
import AIApiScheduler, { aiApiScheduler } from "@/services/AIApiScheduler";
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
    await this.handleApplayMessage(newMessage);

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
      await this.submit(message.trim());
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
   * 应用消息
   * @param message
   */
  public handleApplayMessage = async (message: Message): Promise<void> => {
    return this.chatApply.apply(message);
  };

  /**
   * 当message 为空时表示初始化提示词
   * @param messages
   */
  fetchNewRecommendedKeywords = async (messages: Message[]) => {
    return this.workspaceController.workspaceRecommend.fetchNewRecommendedKeywords(
      messages
    );
  };

  initRecommendedKeywords() {
    return this.workspaceController.workspaceRecommend.initRecommendedKeywords();
  }
}
