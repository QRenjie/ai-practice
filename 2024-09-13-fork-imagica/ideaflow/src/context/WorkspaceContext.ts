import React from "react";
import { ApplyData } from "../services/chatService";
import { CodeBlock, Message, ChatHistory } from "@/types/apiTypes";

interface PreviewState {
  content: string;
}

interface UIState {
  activeTab: "preview" | "codeHistory";
}

interface CodeState {
  mergedCodeBlocks: CodeBlock[];
}

interface ChatState {
  history: ChatHistory[];
  messages: Message[];
}

export interface WorkspaceState {
  ui: UIState;
  preview: PreviewState;
  code: CodeState;
  chat: ChatState;
}

export interface WorkspaceContextType {
  state: WorkspaceState;
  setActiveTab: (tab: UIState["activeTab"]) => void;
  updatePreview: (data: ApplyData) => void;
  addChatMessage: (message: Message) => void;
  updateChatHistory: (history: ChatHistory[]) => void;
  updateMessages: (updater: (prev: Message[]) => Message[]) => void;
  updateMergedCodeBlocks: (blocks: CodeBlock[]) => void;
}

export const defaultWorkspaceState = () =>
  ({
    ui: {
      activeTab: "preview",
    },
    preview: {
      content: "",
    },
    code: {
      mergedCodeBlocks: [],
    },
    chat: {
      history: [],
      messages: [],
    },
  } as WorkspaceState);

const WorkspaceContext = React.createContext<WorkspaceContextType | null>(null);

export default WorkspaceContext;
