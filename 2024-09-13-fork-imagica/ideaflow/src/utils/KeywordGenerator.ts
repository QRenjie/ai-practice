import { streamProcessor } from "@/base/api/StreamProcessor";
import { v4 as uuidv4 } from "uuid";
import { openAIClient } from "@/utils/ServerClient";
import { Message } from "@/types/apiTypes";
import { prompts } from "@/config/prompts";

export interface OpenAIError extends Error {
  response?: {
    status: number;
  };
}

export class KeywordGenerator {
  static getRandomKeywordCount(max = 7): number {
    return Math.floor(Math.random() * (max - 3 + 1)) + 3;
  }

  private static getLastMessages(messages: string[], count: number): string[] {
    return messages.slice(-count);
  }

  static async generateKeywords(
    chatHistory: Message[],
    language: "en" | "zh" = "zh",
    retries = 3
  ): Promise<string[]> {
    const keywordCount = this.getRandomKeywordCount(4);

    const prompt = prompts.generateKeywords[language](
      keywordCount,
      JSON.stringify(chatHistory)
    );

    const messageId = uuidv4();

    try {
      const response = await openAIClient.generateKeywords({
        prompt,
        model: "gpt-4",
      });

      if (!response.data) {
        throw new Error("Response data is undefined");
      }

      const result = await streamProcessor.processStream(
        response,
        messageId,
        () => {} // 这里我们不需要处理每个chunk
      );

      const keywords = result.content
        .split("\n")
        .map((keyword) => keyword.trim())
        .filter(Boolean);

      return keywords.slice(0, keywordCount);
    } catch (error) {
      const openAIError = error as OpenAIError;
      console.error("OpenAI API错误:", openAIError);
      if (retries > 0 && openAIError.response?.status === 409) {
        console.log(`重试生成关键词，剩余尝试次数: ${retries - 1}`);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return this.generateKeywords(chatHistory, language, retries - 1);
      }
      throw openAIError;
    }
  }
}
