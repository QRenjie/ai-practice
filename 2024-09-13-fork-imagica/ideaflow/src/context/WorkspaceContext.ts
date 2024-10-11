import React from "react";
import { CodeBlock, Message } from "@/types/apiTypes";
import workspaceConfig from "../../config/workspace.json"; // 新增这一行
import {
  CodeState,
  ConfigState,
  UIState,
  WorkspaceState,
  WorkspaceType,
} from "@/types/workspace";

export const workspaceOptions = Object.keys(workspaceConfig).map((key) => ({
  label: key,
  value: key,
}));

export interface WorkspaceContextType {
  state: WorkspaceState;
  setActiveTab: (tab: UIState["activeTab"]) => void;
  updateCodeFiles: (files: CodeState["files"], codeBlocks: CodeBlock[]) => void;
  addChatMessage: (message: Message) => void;
  updateMessages: (updater: (prev: Message[]) => Message[]) => void;
  updateRecommendedKeywords: (keywords: string[]) => void;
  toggleChatCollapse: () => void; // 新增这一行
  updateConfig: (config: Partial<ConfigState>) => void;
  resetState: (option: WorkspaceType) => void; // 新增这一行
  toggleWindowed: () => void; // 新增这一行
}

const WorkspaceContext = React.createContext<WorkspaceContextType | null>(null);

export default WorkspaceContext;
