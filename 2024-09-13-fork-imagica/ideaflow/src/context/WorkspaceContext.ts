import React from "react";
import { CodeBlock, Message } from "@/types/apiTypes";
import { LayerState } from "@/components/Layer";
import { merge } from "lodash-es"; // 修改这一行
import workspaceConfig from "../../config/workspace.json"; // 新增这一行
import { v4 as uuidv4 } from "uuid";
import { SandpackProps } from "@codesandbox/sandpack-react";

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

// 定义递归的 DeepPartial 类型
type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

const WorkspaceContext = React.createContext<WorkspaceContextType | null>(null);

export class WorkspaceStateCreator {
  defaultKey: WorkspaceType = "static-html";

  createSelector(source?: DeepPartial<WorkspaceState>) {
    // 创建一个静态的html工作区, 为了控制选择 template
    const defaults = this.create("static-html", source);
    // defaults.code.files = {};
    defaults.code.customSetup = {};
    defaults.code.template = undefined;

    return defaults;
  }

  defaults(source?: DeepPartial<WorkspaceState>) {
    return this.create(this.defaultKey, source);
  }

  create(
    key: WorkspaceType = this.defaultKey,
    source?: DeepPartial<WorkspaceState>,
  ): WorkspaceState {
    const config = workspaceConfig[key] as WorkspaceState | undefined;
    if (!config) {
      throw new Error(`Workspace config not found for key: ${key}`);
    }

    return merge({}, config, source, {
      id: source?.id || uuidv4(),
    });
  }
}

export const workspaceStateCreator = new WorkspaceStateCreator();

export default WorkspaceContext;
