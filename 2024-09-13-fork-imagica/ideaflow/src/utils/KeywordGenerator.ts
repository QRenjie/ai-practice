import { streamProcessor } from "@/utils/StreamProcessor";
import { v4 as uuidv4 } from "uuid";
import { openAIClient } from "@/utils/ServerClient";

export class KeywordGenerator {
  private static getRandomKeywordCount(max = 7): number {
    return Math.floor(Math.random() * (max - 3 + 1)) + 3;
  }

  static async generateKeywords(
    lastMessage: string,
    retries = 3
  ): Promise<string[]> {
    const keywordCount = this.getRandomKeywordCount(4);
    const prompt = `根据以下消息，生成${keywordCount}个相关的关键词或短语，这些关键词应该代表可能的后续问题或讨论方向。请直接列出关键词，每行一个，不要有编号或其他格式：\n\n"${lastMessage}"`;

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

      console.log("AI 响应内容:", result.content); // 添加这行日志

      const keywords = result.content
        .split("\n")
        .map((keyword) => keyword.trim())
        .filter(Boolean);

      console.log("提取的关键词:", keywords); // 添加这行日志

      return keywords.slice(0, keywordCount); // 确保返回指定数量的关键词
    } catch (error) {
      console.error("OpenAI API错误:", error);
      if (retries > 0 && error.response?.status === 409) {
        console.log(`重试生成关键词，剩余尝试次数: ${retries - 1}`);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 等待1秒后重试
        return this.generateKeywords(lastMessage, retries - 1);
      }
      throw error;
    }
  }
}
