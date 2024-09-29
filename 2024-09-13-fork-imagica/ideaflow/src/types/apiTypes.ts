import { StreamApiProcessorType } from "@/base/api/StreamProcessor";

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

export interface Message extends ApiMessage {
  id: string;
  type: "text" | "code" | "markdown";
  codeBlocks?: CodeBlock[];
}

export interface ApiMessage {
  content: string;
  role: "user" | "system" | "assistant";
}
