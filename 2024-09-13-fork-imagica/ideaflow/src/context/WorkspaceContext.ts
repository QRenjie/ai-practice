import React from "react";
import { CodeBlock, Message } from "@/types/apiTypes";
import { merge } from "lodash-es"; // 修改这一行
import workspaceConfig from "../../config/workspace.json"; // 新增这一行
import { v4 as uuidv4 } from "uuid";
import {
  CodeState,
  ConfigState,
  UIState,
  WorkspaceState,
  WorkspaceType,
} from "@/types/workspace";
import { DeepPartial } from "@/types/common";

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
}

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
    source?: DeepPartial<WorkspaceState>
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
