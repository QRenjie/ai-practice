import React from "react";
import { CodeBlock, Message } from "@/types/apiTypes";
import { LayerState } from "@/components/Layer";
import { merge } from "lodash-es"; // 修改这一行
import workspaceConfig from "../../config/workspace.json"; // 新增这一行
import { v4 as uuidv4 } from "uuid";
import { SandpackProps } from "@codesandbox/sandpack-react";

type LocaleKey = string;
interface UIState extends LayerState {
  activeTab: "preview" | "codeHistory";
}

/**
 * @property {template} default: react
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
   * 代码生成提示词, locale:coderPrompt:[template]
   */
  coderPrompt: LocaleKey;
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
  updateCodeFiles: (files: CodeState["files"], codeBlocks: CodeBlock[]) => void;
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

const WorkspaceContext = React.createContext<WorkspaceContextType | null>(null);

export class WorkspaceStateCreator {
  defaultKey: keyof typeof workspaceConfig = "react-base";

  defaults(source?: DeepPartial<WorkspaceState>) {
    return this.create(source, this.defaultKey);
  }

  create(
    source?: DeepPartial<WorkspaceState>,
    key: keyof typeof workspaceConfig = this.defaultKey
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
