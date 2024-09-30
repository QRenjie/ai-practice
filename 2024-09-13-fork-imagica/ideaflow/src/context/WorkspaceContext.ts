import React from "react";
import { CodeBlock, Message } from "@/types/apiTypes";
import { LayerState } from "@/components/Layer";
import { merge, cloneDeep } from "lodash-es"; // 修改这一行
import workspaceConfig from "../../config/workspace.json"; // 新增这一行
import { v4 as uuidv4 } from "uuid";
import { SandpackProps } from "@codesandbox/sandpack-react";

interface UIState extends LayerState {
  activeTab: "preview" | "codeHistory";
}

/**
 * @property {template} default: react
 */
interface CodeState
  extends Pick<SandpackProps, "files" | "customSetup" | "template"> {
  mergedCodeBlocks: CodeBlock[];
  codeBlock?: CodeBlock;
}

interface ChatState {
  messages: Message[];
}

interface ConfigState {
  selectedModel: string;
  recommendedKeywords: string[];
  isChatCollapsed: boolean;
  useLayer: boolean;
}

export interface WorkspaceState {
  id: string;
  ui: UIState;
  config: ConfigState;

  code: CodeState;
  chat: ChatState;
}

export interface WorkspaceContextType {
  state: WorkspaceState;
  setActiveTab: (tab: UIState["activeTab"]) => void;
  updatePreviewCodeBlock: (codeBlock: CodeBlock) => void;
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
  const configCopy = cloneDeep(workspaceConfig.defaultConfig) as WorkspaceState;
  configCopy.id = uuidv4();
  // 使用 lodash 的 merge 方法将 configCopy 和 source 合并
  return merge(configCopy, source);
};

const WorkspaceContext = React.createContext<WorkspaceContextType | null>(null);

export default WorkspaceContext;
