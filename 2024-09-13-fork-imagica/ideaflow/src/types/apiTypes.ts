export interface CodeBlock {
    fileName: string;
    language: string;
    code: string;
}

export interface AIResponseData {
    id: string;
    content: string;
    codeBlocks: CodeBlock[];
}

export interface AIResponseError {
    error: string;
}

export type AIResponse = AIResponseData | AIResponseError;

export interface Message {
    id: string;
    text: string;
    sender: "user" | "bot";
    type: "text" | "code" | "markdown";
    codeBlocks?: CodeBlock[];
}