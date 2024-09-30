import { WorkspaceContextType } from "./../context/WorkspaceContext";
import { RefObject } from "react";
import { AiChatResponse, CodeBlock, Message } from "@/types/apiTypes";
import { CodeBlocks } from "@/utils/CodeBlocks";
import AIApiScheduler from "./AIApiScheduler";
import prompts from "../../config/prompts.json";
import { MessageFactory } from "./MessageFactory"; // 新增导入
import { SandpackFile } from "@codesandbox/sandpack-react";
import sandpackFile from "../../config/sandpackFile";
import ApiCommonParams from "@/utils/ApiCommonParams";
import { cloneDeep } from "lodash-es";

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
          messages: [
            ...this.chatMessages,
            this.messageFactory.createUserMessage(message),
          ],
          componentType: this.context.state.config.componentType,
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
    // 将codeBlocks中的每一个codeBlock 和 files 中的每一个文件合并

    const result = cloneDeep(this.context.state.code.files || {});
    codeBlocks.forEach((codeBlock) => {
      const target = result[codeBlock.fileName];
      if (target) {
        // 如果 target 是 string 类型, 则转成通用类型
        if (typeof target === "string") {
          result[codeBlock.fileName] = sandpackFile(codeBlock.content);
        } else {
          (result[codeBlock.fileName] as SandpackFile) = {
            ...target,
            code: codeBlock.content,
          };
        }
      }
    });

    console.log("jj updatePreviewCodeBlocks", result);

    this.context.updateCodeFiles(result, codeBlocks);
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
          ? prompts.initRecommond
          : prompts.contextPromptTemplate.replace(
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
