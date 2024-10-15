import JSONUtil from "@/utils/JSONUtil";

export type StreamApiProcessorType = {
  id: string;
  content: string;
};

export class StreamProcessor {
  private decoder = new TextDecoder("utf-8");
  private buffer = "";

  async processStream(
    response: Response,
    messageId: string,
    onChunk?: (chunk: string) => void
  ): Promise<StreamApiProcessorType> {
    let fullContent = "";

    if (!response.body) {
      throw new Error("Response body is null");
    }

    const reader = response.body.getReader();

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const decodedChunk = this.decoder.decode(value, { stream: true });
        const { processedContent, shouldStop } = await this.processChunk(
          decodedChunk,
          onChunk
        );
        fullContent += processedContent;

        if (shouldStop) break;
      }
    } finally {
      reader.releaseLock();
    }

    return {
      id: messageId,
      content: fullContent,
    };
  }

  private async processChunk(
    chunk: string,
    onChunk?: (chunk: string) => void
  ): Promise<{ processedContent: string; shouldStop: boolean }> {
    let processedContent = "";
    let shouldStop = false;
    
    this.buffer += chunk;
    const lines = this.buffer.split("\n");
    
    // 保留最后一行，可能是不完整的
    this.buffer = lines.pop() || "";

    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6).trim();
        if (data === "[DONE]") {
          shouldStop = true;
          break;
        }
        try {
          const parsed = JSONUtil.parse(data);
          const content = parsed.choices[0]?.delta?.content || "";
          processedContent += content;
          onChunk?.(content);
        } catch (error) {
          console.error("解析错误:", error);
          // 不完整的 JSON，添加回 buffer
          this.buffer = line + "\n" + this.buffer;
        }
      }
    }

    return { processedContent, shouldStop };
  }
}

export const streamProcessor = new StreamProcessor();
