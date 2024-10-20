import { WorkspaceState, WorkspaceType } from "@/types/workspace";
import { CodeBlock, Message } from "@/types/apiTypes";
import { workspaceStateCreator } from "@/utils/WorkspaceStateCreator";
import { merge } from "lodash-es";
import { WorkspaceLocalState } from "@/container/WorkspaceContext";

export class WorkspaceController {
  constructor(
    public state: WorkspaceState,
    private setState: React.Dispatch<React.SetStateAction<WorkspaceState>>,

    public localState: WorkspaceLocalState,
    private setLocalState: React.Dispatch<
      React.SetStateAction<WorkspaceLocalState>
    >
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
      const newState = workspaceStateCreator.create(option);
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
}
