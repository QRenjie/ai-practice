import { WorkspaceState, WorkspaceType } from "@/types/workspace";
import { CodeBlock, Message } from "@/types/apiTypes";
import { workspaceStateCreator } from "@/utils/WorkspaceStateCreator";
import { merge } from "lodash-es";
import { WorkspaceStore } from "@/store/WorkspaceStore";

export class WorkspaceController {
  constructor(public store: WorkspaceStore) {}

  get state() {
    return this.store.state;
  }

  setActiveTab = (tab: WorkspaceState["ui"]["activeTab"]) => {
    this.store.setState((prevState) => ({
      ...prevState,
      ui: { ...prevState.ui, activeTab: tab },
    }));
  };

  updateCodeFiles = (
    files: WorkspaceState["code"]["files"],
    codeBlocks: CodeBlock[]
  ) => {
    this.store.setState((prevState) => ({
      ...prevState,
      code: {
        ...prevState.code,
        codeBlocks,
        files: {
          ...prevState.code.files,
          ...files,
        },
      },
    }));
  };

  addChatMessage = (message: Message) => {
    this.store.setState((prevState) => ({
      ...prevState,
      chat: {
        ...prevState.chat,
        messages: [...prevState.chat.messages, message],
      },
    }));
  };

  updateMessages = (updater: (prev: Message[]) => Message[]) => {
    this.store.setState((prevState) => ({
      ...prevState,
      chat: {
        ...prevState.chat,
        messages: updater(prevState.chat.messages),
      },
    }));
  };

  updateRecommendedKeywords = (keywords: string[]) => {
    this.store.setState((prevState) => ({
      ...prevState,
      config: {
        ...prevState.config,
        recommendedKeywords: keywords,
      },
    }));
  };

  updateConfig = (config: Partial<WorkspaceState["config"]>) => {
    this.store.setState((prevState) => ({
      ...prevState,
      config: {
        ...prevState.config,
        ...config,
      },
    }));
  };

  toggleChatCollapse = () => {
    this.store.setState((prevState) => ({
      ...prevState,
      config: {
        ...prevState.config,
        isChatCollapsed: !prevState.config.isChatCollapsed,
      },
    }));
  };

  resetState = (option: WorkspaceType) => {
    this.store.setState((prev) => {
      const newState = workspaceStateCreator.create(option);
      newState.ui.title = prev.ui.title;
      return newState;
    });
  };

  toggleWindowed = () => {
    this.store.setState((prevState) =>
      merge({}, prevState, {
        config: {
          isWindowed: !prevState.config.isWindowed,
        },
        ui: {
          size: prevState.config.isWindowed
            ? { width: "100%", height: "100%" }
            : undefined,
        },
      })
    );
  };
}
