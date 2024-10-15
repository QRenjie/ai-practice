import type { LayerState } from "@/components/Layer";
import { CodeBlock, Message } from "./apiTypes";
import { SandpackProps } from "@codesandbox/sandpack-react";

export type WorkspaceType = keyof typeof import("../../config/workspace.json");

export type LocaleKey = string;

export interface UIState extends LayerState {
  activeTab: "preview" | "code";
}

/**
 * @property {template} default: react
 *
 * customSetup: 被启用，使用package.json 直接替换，他会导致拖慢项目启动
 */
export interface CodeState
  extends Pick<SandpackProps, "files" | "customSetup" | "template"> {
  codeBlock?: CodeBlock;
}

export interface ChatState {
  /**
   * 聊天记录
   */
  messages: Message[];
}

export interface ConfigState {
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

  /**
   * 图片
   */
  image?: string;

  /**
   * 是否
   */
  public: boolean

  /**
   * 用户信息
   */
  user?: {
    avatar: string;
    name: string;
  };
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
