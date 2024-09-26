import React from "react";
import { ApplyData } from "../services/chatService";
import { CodeBlock, Message } from "@/types/apiTypes";

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
  messages: Message[];
}

interface ConfigState {
  selectedModel: string;
  recommendedKeywords: string[];
}

export interface WorkspaceState {
  ui: UIState;
  preview: PreviewState;
  code: CodeState;
  chat: ChatState;
  config: ConfigState;
}

export interface WorkspaceContextType {
  state: WorkspaceState;
  setActiveTab: (tab: UIState["activeTab"]) => void;
  updatePreview: (data: ApplyData) => void;
  addChatMessage: (message: Message) => void;
  updateMessages: (updater: (prev: Message[]) => Message[]) => void;
  updateMergedCodeBlocks: (blocks: CodeBlock[]) => void;
  updateRecommendedKeywords: (keywords: string[]) => void;
}

export const defaultWorkspaceState = () =>
  ({
    config: {
      selectedModel: "gpt-3.5-turbo",
      recommendedKeywords: [],
    },
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
      messages: [],
    },
  } as WorkspaceState);

const WorkspaceContext = React.createContext<WorkspaceContextType | null>(null);

export default WorkspaceContext;
