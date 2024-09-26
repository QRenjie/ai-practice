import { streamProcessor } from "@/utils/StreamProcessor";
import { v4 as uuidv4 } from "uuid";
import { openAIClient } from "@/utils/ServerClient";

export class KeywordGenerator {
  private static getRandomKeywordCount(max = 7): number {
    return Math.floor(Math.random() * (max - 3 + 1)) + 3;
  }

  static async generateKeywords(
    userMessage: string,
    aiResponse: string,
    retries = 3
  ): Promise<string[]> {
    const keywordCount = this.getRandomKeywordCount(4);
    const prompt = `基于以下用户消息和AI回答，生成${keywordCount}个相关的关键词、短语或后续问题。这些内容应该是用户可能想要进一步了解或讨论的主题。请提供多样化的内容，包括但不限于：单词、短语、概念和问题。每行一个，不要有编号或其他格式：

用户消息：
"${userMessage}"

AI回答：
"${aiResponse}"`;

    const messageId = uuidv4();

    try {
      const response = await openAIClient.generateKeywords({ prompt });

      if (!response.data) {
        throw new Error("Response data is undefined");
      }

      const result = await streamProcessor.processStream(
        response,
        messageId,
        () => {} // 这里我们不需要处理每个chunk
      );

      console.log("AI 响应内容:", result.content);

      const keywords = result.content
        .split("\n")
        .map((keyword) => keyword.trim())
        .filter(Boolean);

      console.log("提取的关键词:", keywords);

      return keywords.slice(0, keywordCount);
    } catch (error) {
      console.error("OpenAI API错误:", error);
      if (retries > 0 && error.response?.status === 409) {
        console.log(`重试生成关键词，剩余尝试次数: ${retries - 1}`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return this.generateKeywords(userMessage, aiResponse, retries - 1);
      }
      throw error;
    }
  }
}
