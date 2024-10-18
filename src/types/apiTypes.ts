import { StreamApiProcessorType } from "@/base/api/StreamProcessor";

export interface CodeBlock {
  /**
   * 文件名，没有 / 开头
   */
  fileName: string;
  // html python jsx tsx
  language: string;
  content: string;
}

export interface AiChatResponse extends StreamApiProcessorType {
  codeBlocks: CodeBlock[];
}

export interface AIResponseError {
  error: string;
}

export type AIResponse = AiChatResponse | AIResponseError;

export interface Message extends ApiMessage {
  content: string;
  role: "user" | "system" | "assistant";

  id: string;
  type: "text" | "code" | "markdown";
  codeBlocks?: CodeBlock[];
}

export interface ApiMessage {
  content: string;
  role: "user" | "system" | "assistant";
}
