import { AxiosResponse } from "axios";

export type StreamApiProcessorType = {
  id: string;
  content: string;
};

export class StreamProcessor {
  private decoder = new TextDecoder("utf-8");

  async processStream(
    response: AxiosResponse,
    messageId: string,
    onChunk: (chunk: string) => void
  ): Promise<StreamApiProcessorType> {
    let fullContent = "";

    if (!response.data) {
      throw new Error("Response data is undefined");
    }

    // 检查 response.data 是否是可迭代的
    if (typeof response.data[Symbol.asyncIterator] === "function") {
      for await (const chunk of response.data) {
        const decodedChunk = this.decoder.decode(chunk);
        fullContent += await this.processChunk(decodedChunk, onChunk);
      }
    } else if (typeof response.data === "string") {
      // 如果 response.data 是字符串，直接处理
      fullContent = await this.processChunk(response.data, onChunk);
    } else {
      throw new Error("Unsupported response data type");
    }

    return {
      id: messageId,
      content: fullContent,
    };
  }

  private async processChunk(
    chunk: string,
    onChunk: (chunk: string) => void
  ): Promise<string> {
    let processedContent = "";
    const lines = chunk.split("\n").filter((line) => line.trim() !== "");

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6);
        if (data === "[DONE]") {
          break;
        }
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices[0]?.delta?.content || "";
          processedContent += content;
          onChunk(content);
        } catch (error) {
          console.error("解析错误:", error);
        }
      }
    }

    return processedContent;
  }
}

export const streamProcessor = new StreamProcessor();
