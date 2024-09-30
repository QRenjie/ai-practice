import { StreamApiProcessorType } from "@/base/api/StreamProcessor";
import { WorkspaceState } from "@/context/WorkspaceContext";

export interface CodeBlock {
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
  id: string;
  type: "text" | "code" | "markdown";
  codeBlocks?: CodeBlock[];
}

export interface ApiMessage {
  content: string;
  role: "user" | "system" | "assistant";
}
