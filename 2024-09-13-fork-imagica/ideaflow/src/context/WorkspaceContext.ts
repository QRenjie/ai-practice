import React from "react";
import { ApplyData } from "../services/chatService";
import { CodeBlock, Message } from "@/types/apiTypes";
import { LayerState } from "@/components/Layer";
import { merge, cloneDeep } from "lodash-es"; // 修改这一行
import workspaceConfig from "../config/workspace.json"; // 新增这一行
import { v4 as uuidv4 } from "uuid";

interface PreviewState {
  content: string;
}

interface UIState {
  activeTab: "preview" | "codeHistory";
  size: { width: number; height: number };
  position: { x: number; y: number };
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
  isChatCollapsed: boolean;
}

export interface WorkspaceState {
  id: string;
  ui: UIState;
  preview: PreviewState;
  code: CodeState;
  chat: ChatState;
  config: ConfigState;
  layer: LayerState;
}

export interface WorkspaceContextType {
  state: WorkspaceState;
  setActiveTab: (tab: UIState["activeTab"]) => void;
  updatePreview: (data: ApplyData) => void;
  addChatMessage: (message: Message) => void;
  updateMessages: (updater: (prev: Message[]) => Message[]) => void;
  updateMergedCodeBlocks: (blocks: CodeBlock[]) => void;
  updateRecommendedKeywords: (keywords: string[]) => void;
  toggleChatCollapse: () => void; // 新增这一行
}

// 定义递归的 DeepPartial 类型
type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export const defaultWorkspaceState = (
  source?: DeepPartial<WorkspaceState>
): WorkspaceState => {
  // 深复制 workspaceConfig
  const configCopy = cloneDeep(workspaceConfig) as WorkspaceState;
  configCopy.id = uuidv4();
  // 使用 lodash 的 merge 方法将 configCopy 和 source 合并
  return merge(configCopy, source);
};

const WorkspaceContext = React.createContext<WorkspaceContextType | null>(null);

export default WorkspaceContext;
