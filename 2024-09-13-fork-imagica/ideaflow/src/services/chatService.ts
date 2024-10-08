import { WorkspaceContextType } from "./../context/WorkspaceContext";
import { RefObject } from "react";
import { AiChatResponse, CodeBlock, Message } from "@/types/apiTypes";
import { CodeBlocks } from "@/utils/CodeBlocks";
import AIApiScheduler from "./AIApiScheduler";
import { MessageFactory } from "./MessageFactory"; // 新增导入
import { SandpackFile } from "@codesandbox/sandpack-react";
import sandpackFile from "../../config/sandpackFile";
import ApiCommonParams from "@/utils/ApiCommonParams";
import { cloneDeep } from "lodash-es";
import { locales } from "@/utils/Locales";

export type ApplyData = { type: "html" | "python"; content: string };

export class ChatController {
  private inputRef: RefObject<HTMLTextAreaElement> | null = null;
  aIApiScheduler: AIApiScheduler;
  private messageFactory: MessageFactory;

  constructor(
    public context: WorkspaceContextType,
    private setIsLoading: (isLoading: boolean) => void
  ) {
    this.aIApiScheduler = new AIApiScheduler();
    this.messageFactory = new MessageFactory();
  }

  setInputRef(ref: RefObject<HTMLTextAreaElement>) {
    this.inputRef = ref;
  }

  get state() {
    return this.context.state;
  }

  get chatMessages() {
    return this.context.state.chat.messages;
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
      this.context.addChatMessage(
        this.messageFactory.createUserMessage(message)
      );

      // 调用AI接口
      const aiResponse = await this.aIApiScheduler.callOpenAIStream(
        new ApiCommonParams({
          model: this.context.state.config.selectedModel,
          coderPrompt: this.context.state.config.coderPrompt,
          messages: [
            ...this.chatMessages,
            this.messageFactory.createUserMessage(message),
          ],
        })
      );

      // 创建AI消息, 并合并codeBlocks
      const newMessage = this.createCodeBlockMessage(aiResponse);

      // 新增AI消息
      this.context.addChatMessage(newMessage);

      // 重新应用消息
      this.reapplyAiMessage(newMessage);

      // 获取新的推荐关键词
      if (this.chatMessages.length >= 1) {
        this.fetchNewRecommendedKeywords([...this.chatMessages, newMessage]);
      }
    } catch (error) {
      console.error("handleSubmit error", error);
      const errorMessage = this.messageFactory.createErrorMessage(error);
      this.context.addChatMessage(errorMessage);
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
    const message = this.messageFactory.createAssistantMessage(aiResponse);

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
      console.error("无法复制文本: ", err);
    }
  };

  /**
   * 重新应用消息
   * @param message
   */
  public reapplyAiMessage = async (message: Message): Promise<void> => {
    if (message.role === "user") {
      console.warn("只能重新应用ai消息");
      return;
    }

    if (Array.isArray(message.codeBlocks)) {
      this.updatePreviewCodeBlocks(message.codeBlocks);
    }
  };

  updatePreviewCodeBlocks(codeBlocks: CodeBlock[]) {
    const result = cloneDeep(this.context.state.code.files || {});
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

    console.log("更新预览代码块", result);

    this.context.updateCodeFiles(result, codeBlocks);

    // TODO: 自动刷新preivew
  }

  /**
   * 当message 为空时表示初始化提示词
   * @param messages
   */
  fetchNewRecommendedKeywords = async (messages: Message[]) => {
    try {
      const aIApiScheduler = new AIApiScheduler();
      const prompt =
        messages.length === 0
          ? locales.get("locale:initRecommond")
          : locales.get("locale:contextPromptTemplate").replace(
              "{{chatHistory}}",
              MessageFactory.toApiMessage(messages)
                .map((msg) => msg.content)
                .join("\n")
            );

      const aiApiParams = new ApiCommonParams({
        model: this.context.state.config.selectedModel,
        messages: [this.messageFactory.createUserMessage(prompt)],
      });

      const response = await aIApiScheduler.getRecommendedKeywords(aiApiParams);
      if (response.keywords && response.keywords.length > 0) {
        this.context.updateRecommendedKeywords(response.keywords);
      } else {
        console.warn("未收到有效的关键词");
      }
    } catch (error) {
      console.error("获取推荐关键词失败:", error);
    }
  };

  initRecommendedKeywords() {
    this.fetchNewRecommendedKeywords([]);
  }
}
