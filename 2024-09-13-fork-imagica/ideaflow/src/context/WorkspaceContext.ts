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
  /**
   * @deprecated
   */
  codeBlock?: CodeBlock;
}

interface ChatState {
  /**
   * 聊天记录
   */
  messages: Message[];
}

interface ConfigState {
  /**
   * 当前选中的模型
   */
  selectedModel: string;
  /**
   * 推荐的关键词
   */
  recommendedKeywords: string[];
  /**
   * 是否折叠聊天记录
   */
  isChatCollapsed: boolean;
  /**
   * 是否使用图层， 是否可以拖拉拽
   */
  isWindowed: boolean;
}

export interface WorkspaceState {
  /**
   * 唯一标识
   */
  id: string;
  /**
   * 用户界面状态
   */
  ui: UIState;
  /**
   * 配置状态
   */
  config: ConfigState;
  /**
   * 代码状态
   */
  code: CodeState;
  /**
   * 聊天状态
   */
  chat: ChatState;
}

export interface WorkspaceContextType {
  state: WorkspaceState;
  setActiveTab: (tab: UIState["activeTab"]) => void;
  updateCodeFiles: (files: CodeState["files"]) => void;
  addChatMessage: (message: Message) => void;
  updateMessages: (updater: (prev: Message[]) => Message[]) => void;
  updateRecommendedKeywords: (keywords: string[]) => void;
  toggleChatCollapse: () => void; // 新增这一行
  updateConfig: (config: Partial<ConfigState>) => void;
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
