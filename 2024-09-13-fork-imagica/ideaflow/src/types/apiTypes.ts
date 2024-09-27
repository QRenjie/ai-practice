import { StreamApiProcessorType } from "@/utils/StreamProcessor";

export interface CodeBlock {
  fileName: string;
  language: string;
  code: string;
}

export interface AiChatResponse extends StreamApiProcessorType {
  codeBlocks: CodeBlock[];
}

export interface AIResponseError {
  error: string;
}

export type AIResponse = AiChatResponse | AIResponseError;

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  type: "text" | "code" | "markdown";
  codeBlocks?: CodeBlock[];
}
