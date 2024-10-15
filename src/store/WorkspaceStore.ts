import { WorkspaceLocalState } from "@/container/WorkspaceContext";
import { CodeBlock, Message } from "@/types/apiTypes";
import { WorkspaceState, WorkspaceType } from "@/types/workspace";
import { WorkspaceStateCreator } from "@/utils/WorkspaceStateCreator";
import { merge } from "lodash-es";

export class WorkspaceStore {
  constructor(
    public state: WorkspaceState,
    private setState: React.Dispatch<React.SetStateAction<WorkspaceState>>,
    public localState: WorkspaceLocalState,
    private setLocalState: React.Dispatch<
      React.SetStateAction<WorkspaceLocalState>
    >,

    private workspaceStateCreator: WorkspaceStateCreator
  ) {}

  setActiveTab = (tab: WorkspaceState["ui"]["activeTab"]) => {
    this.setState((prevState) => ({
      ...prevState,
      ui: { ...prevState.ui, activeTab: tab },
    }));
  };

  updateCodeFiles = (
    files: WorkspaceState["code"]["files"],
    codeBlocks: CodeBlock[]
  ) => {
    this.setState((prevState) => ({
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
    this.setState((prevState) => ({
      ...prevState,
      chat: {
        ...prevState.chat,
        messages: [...prevState.chat.messages, message],
      },
    }));
  };

  updateMessages = (updater: (prev: Message[]) => Message[]) => {
    this.setState((prevState) => ({
      ...prevState,
      chat: {
        ...prevState.chat,
        messages: updater(prevState.chat.messages),
      },
    }));
  };

  updateRecommendedKeywords = (keywords: string[]) => {
    this.setState((prevState) => ({
      ...prevState,
      config: {
        ...prevState.config,
        recommendedKeywords: keywords,
      },
    }));
  };

  updateConfig = (config: Partial<WorkspaceState["config"]>) => {
    this.setState((prevState) => ({
      ...prevState,
      config: {
        ...prevState.config,
        ...config,
      },
    }));
  };

  toggleChatCollapse = () => {
    this.setState((prevState) => ({
      ...prevState,
      config: {
        ...prevState.config,
        isChatCollapsed: !prevState.config.isChatCollapsed,
      },
    }));
  };

  resetState = (option: WorkspaceType) => {
    this.setState((prev) => {
      const newState = this.workspaceStateCreator.create(option);
      newState.ui.title = prev.ui.title;
      return newState;
    });
  };

  toggleWindowed = () => {
    this.setState((prevState) =>
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

  toggleArea = () => {
    this.setState((prevState) => ({
      ...prevState,
      ui: {
        ...prevState.ui,
        activeTab: prevState.ui.activeTab === "preview" ? "code" : "preview",
      },
    }));
  };

  togglePreviewMask = (show: boolean = false) => {
    this.setLocalState((prevState) => ({
      ...prevState,
      stopPreviewMask: show,
    }));
  };

  updateTitle = (title: string) => {
    this.setState((prevState) => ({
      ...prevState,
      ui: { ...prevState.ui, title },
    }));
  };

  /**
   * state 如果需要在更新ui后才会变成最新状态, 则需要调用此方法
   * @returns
   */
  getState = async (): Promise<WorkspaceState> => {
    return new Promise((resolve) => {
      this.setState((state) => {
        resolve(state);
        return state;
      });
    });
  };

  updateMeta = (meta: Partial<WorkspaceState["meta"]>) => {
    this.setState((prevState) => ({
      ...prevState,
      meta: { ...prevState.meta, ...meta },
    }));
  };

  hasMessages = () => {
    return this.state.chat.messages.length > 0;
  };
}
