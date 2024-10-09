import { WorkspaceState, WorkspaceType } from "@/context/WorkspaceContext";
import { CodeBlock, Message } from "@/types/apiTypes";
import { DeepPartial } from "@/types/common";
import { WorkspaceStateCreator } from "@/utils/WorkspaceStateCreator";
import { SliceStore } from "@qlover/slice-store";
import { merge } from "lodash-es";

export class WorkspaceStore extends SliceStore<WorkspaceState> {
  constructor(
    public workspaceStateCreator: WorkspaceStateCreator,
    initialState?: WorkspaceState
  ) {
    super(() => initialState ?? workspaceStateCreator.defaults());
  }

  private updateState = (updates: DeepPartial<WorkspaceState>) => {
    const newState = merge({}, this.state, updates);
    console.log('newState', newState);
    
    this.emit(newState);
  };

  setActiveTab = (activeTab: WorkspaceState["ui"]["activeTab"]) =>
    this.updateState({ ui: { activeTab } });

  updateCodeFiles = (
    files: WorkspaceState["code"]["files"],
    codeBlock?: CodeBlock
  ) => this.updateState({ code: { files, codeBlock } });

  addChatMessage = (message: Message) =>
    this.updateState({
      chat: { messages: [...this.state.chat.messages, message] },
    });

  updateMessages = (messages: Message[]) =>
    this.updateState({ chat: { messages } });

  updateRecommendedKeywords = (recommendedKeywords: string[]) =>
    this.updateState({ config: { recommendedKeywords } });

  toggleChatCollapse = () =>
    this.updateState({
      config: { isChatCollapsed: !this.state.config.isChatCollapsed },
    });

  updateConfig = (newConfig: Partial<WorkspaceState["config"]>) =>
    this.updateState({ config: newConfig });

  resetState = (option: WorkspaceType) => {
    const newState = this.workspaceStateCreator.create(option);
    newState.ui.title = this.state.ui.title;

    if (newState) this.emit(newState);
  };
}
