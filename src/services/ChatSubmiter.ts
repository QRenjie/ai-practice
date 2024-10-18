import AIApiScheduler from "./AIApiScheduler";
import { WorkspaceController } from "@/controllers/WorkspaceController";
import { AiChatResponse, Message } from "@/types/apiTypes";
import ApiCommonParams from "@/utils/ApiCommonParams";
import { MessageCreator } from "@/utils/MessageCreator";
import { log } from "@/utils/log";

export class ChatSubmiter {
  constructor(
    private aIApiScheduler: AIApiScheduler,
    private workspaceController: WorkspaceController
  ) {}

  /**
   * 创建提交AI接口的参数
   * @param newMessage
   * @returns
   */
  getSubmitParams(newMessage: string): ApiCommonParams {
    const workspaceState = this.workspaceController.getState();
    const { config, chat } = workspaceState;
    return new ApiCommonParams({
      locales: this.workspaceController.locales,
      model: config.selectedModel,
      coderPrompt: config.coderPrompt,
      messages: [
        ...chat.messages,
        MessageCreator.createUserMessage(newMessage),
      ],
    });
  }

  /**
   * 创建包含codeBlocks的message
   * @param aiResponse
   * @returns
   */
  createNewMessage(aiResponse: AiChatResponse): Message {
    // 创建AI消息, 并合并最后一条AI消息的code
    const targetMessage = MessageCreator.getPreviousAiMessage(
      this.workspaceController.getState().chat.messages
    );

    log.debug("targetMessage", targetMessage);
    return MessageCreator.createAssistantMessage(aiResponse, targetMessage);
  }

  /**
   * 提交消息
   * @param userInput
   * @returns
   */
  async submit(message: Message): Promise<Message> {
    // 创建AI接口参数
    const aiApiParams = this.getSubmitParams(message.content);

    // 调用AI接口
    const aiResponse = await this.aIApiScheduler.callOpenAIStream(aiApiParams);

    const newMessage = this.createNewMessage(aiResponse);

    return newMessage;
  }
}
