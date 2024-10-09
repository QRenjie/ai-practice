import React, { useContext } from "react";
import { CodeBlock, Message } from "@/types/apiTypes";
import { LayerState } from "@/components/Layer";
import workspaceConfig from "../../config/workspace.json"; // 新增这一行
import { SandpackProps } from "@codesandbox/sandpack-react";
import { WorkspaceStore } from "@/store/WorkspaceStore";
import { useSliceStore } from "@qlover/slice-store-react";

export type WorkspaceType = keyof typeof workspaceConfig;
export const workspaceOptions = Object.keys(workspaceConfig).map((key) => ({
  label: key,
  value: key,
}));

type LocaleKey = string;
interface UIState extends LayerState {
  activeTab: "preview" | "codeHistory";
}

/**
 * @property {template} default: react
 *
 * customSetup: 被启用，使用package.json 直接替换，他会导致拖慢项目启动
 */
interface CodeState
  extends Pick<SandpackProps, "files" | "customSetup" | "template"> {
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

  /**
   * 是否加载中
   */
  isSandpackLoading: boolean;

  /**
   * 代码生成提示词, locale:coderPrompt:[template]
   */
  coderPrompt: LocaleKey;
}

export interface MetaState {
  /**
   * 更新时间
   */
  updatedAt?: number;
}
export interface WorkspaceState {
  /**
   * 唯一标识
   */
  id: string;

  meta: MetaState;
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
  updateCodeFiles: (files: CodeState["files"], codeBlocks: CodeBlock[]) => void;
  addChatMessage: (message: Message) => void;
  updateMessages: (updater: (prev: Message[]) => Message[]) => void;
  updateRecommendedKeywords: (keywords: string[]) => void;
  toggleChatCollapse: () => void; // 新增这一行
  updateConfig: (config: Partial<ConfigState>) => void;
  resetState: (option: WorkspaceType) => void; // 新增这一行
}

const WorkspaceContext = React.createContext<WorkspaceStore | null>(null);

export default WorkspaceContext;

export function useWorkspaceStoreState(): [WorkspaceState, WorkspaceStore] {
  const workspaceStore = useContext(WorkspaceContext)!;
  const state = useSliceStore(workspaceStore);
  console.log('store state', state);
  return [state, workspaceStore];
}
