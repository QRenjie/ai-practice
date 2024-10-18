import { WorkspaceController } from "@/controllers/WorkspaceController";
import { RefObject } from "react";
import { AiChatResponse, CodeBlock, Message } from "@/types/apiTypes";
import { CodeBlocks } from "@/utils/CodeBlocks";
import AIApiScheduler, { aiApiScheduler } from "@/services/AIApiScheduler";
import { SandpackFile } from "@codesandbox/sandpack-react";
import sandpackFile from "config/sandpackFile";
import ApiCommonParams from "@/utils/ApiCommonParams";
import { cloneDeep } from "lodash-es";
import { AiMessageFactory } from "@/utils/AiMessageFactory";
import { log } from "@/utils/log";

export type ApplyData = { type: "html" | "python"; content: string };

export class ChatController {
  private inputRef: RefObject<HTMLTextAreaElement> | null = null;
  aIApiScheduler: AIApiScheduler;

  constructor(
    public workspaceController: WorkspaceController,
    private setIsLoading: (isLoading: boolean) => void
  ) {
    this.aIApiScheduler = aiApiScheduler;
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

  get previewAiMessage(): Message | undefined {
    return this.chatMessages.findLast(
      (message) => message.role === "assistant"
    );
  }
  get previousAiCodeBlocks(): CodeBlock[] {
    return this.previewAiMessage?.codeBlocks || [];
  }

  public async handleSubmit(): Promise<void> {
    const message = this.inputRef?.current?.value || "";
    if (!message.trim()) return;

    this.setIsLoading(true);
    try {
      // 新增用户消息
      this.workspaceController.store.addChatMessage(
        AiMessageFactory.createUserMessage(message)
      );
      // 调用AI接口
      const aiResponse = await this.aIApiScheduler.callOpenAIStream(
        new ApiCommonParams({
          locales: this.workspaceController.locales,
          model: this.state.config.selectedModel,
          coderPrompt: this.state.config.coderPrompt,
          messages: [
            ...this.chatMessages,
            AiMessageFactory.createUserMessage(message),
          ],
        })
      );

      // 创建AI消息, 并合并codeBlocks
      const newMessage = this.createCodeBlockMessage(aiResponse);

      // 新增AI消息
      this.workspaceController.store.addChatMessage(newMessage);

      // 重新应用消息
      this.reapplyAiMessage(newMessage);

      // 获取新的推荐关键词
      if (this.chatMessages.length >= 1) {
        this.fetchNewRecommendedKeywords([...this.chatMessages, newMessage]);
      }
    } catch (error) {
      log.error("handleSubmit error", error);
      const errorMessage = AiMessageFactory.createErrorMessage(error);
      this.workspaceController.store.addChatMessage(errorMessage);
    } finally {
      this.setIsLoading(false);
      if (this.inputRef?.current) {
        this.inputRef.current.value = "";
      }
    }
  }

  /**
   * 创建包含codeBlocks的message
   * @param message
   */
  private createCodeBlockMessage(aiResponse: AiChatResponse): Message {
    const message = AiMessageFactory.createAssistantMessage(aiResponse);

    // 获取上一次的最后一条AI消息, 合并codeBlocks
    const blocks = CodeBlocks.mergeCodeBlocks(
      this.previousAiCodeBlocks,
      message
    );

    message.codeBlocks = blocks;

    return message;
  }

  public handleKeyPress = (e: React.KeyboardEvent<Element>): void => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      this.handleSubmit();
    }
  };

  public copyToClipboard = async (text: string): Promise<void> => {
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
    if (message.role === "user") {
      log.warn("只能重新应用ai消息");
      return;
    }

    if (Array.isArray(message.codeBlocks)) {
      this.updatePreviewCodeBlocks(message.codeBlocks);
    }
  };

  updatePreviewCodeBlocks(codeBlocks: CodeBlock[]) {
    const result = cloneDeep(this.state.code.files || {});
    codeBlocks.forEach((codeBlock) => {
      // 确保 fileName 以 "/" 开头
      const fileName = codeBlock.fileName.startsWith("/")
        ? codeBlock.fileName
        : `/${codeBlock.fileName}`;
      const target = result[fileName];
      if (target) {
        if (typeof target === "string") {
          result[fileName] = sandpackFile(codeBlock.content);
        } else {
          (result[fileName] as SandpackFile) = {
            ...target,
            code: codeBlock.content,
          };
        }
      } else {
        // 如果文件不存在，创建新文件
        result[fileName] = sandpackFile(codeBlock.content);
      }
    });

    log.log("更新预览代码块", result);

    this.workspaceController.store.updateCodeFiles(result, codeBlocks);

    // TODO: 自动刷新preivew
  }

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
                chatHistory: AiMessageFactory.toApiMessage(messages)
                  .map((msg) => msg.content)
                  .join("\n"),
              }
            );

      const aiApiParams = new ApiCommonParams({
        locales: this.workspaceController.locales,
        model: this.state.config.selectedModel,
        messages: [AiMessageFactory.createUserMessage(prompt)],
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
