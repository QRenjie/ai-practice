import React from "react";
import WorkspaceContext, { WorkspaceState } from "../context/WorkspaceContext";
import { workspaceStateCreator } from "@/utils/WorkspaceStateCreator";
import { WorkspaceStore } from "@/store/WorkspaceStore";
import { useCreation } from "ahooks";

const WorkspacePovider: React.FC<{
  initialState: WorkspaceState;
  children: React.ReactNode;
}> = ({ initialState, children }) => {
  const workspaceStore = useCreation(
    () => new WorkspaceStore(workspaceStateCreator, initialState),
    []
  );

  // const [state, setState] = useState<WorkspaceState>(initialState);

  // useEffect(() => {
  //   setState(initialState);
  // }, [initialState]);

  // const setActiveTab = useCallback((tab: WorkspaceState["ui"]["activeTab"]) => {
  //   setState((prevState) => ({
  //     ...prevState,
  //     ui: { ...prevState.ui, activeTab: tab },
  //   }));
  // }, []);

  // const updateCodeFiles = useCallback(
  //   (files: WorkspaceState["code"]["files"], codeBlocks: CodeBlock[]) => {
  //     setState((prevState) => ({
  //       ...prevState,
  //       code: {
  //         ...prevState.code,
  //         codeBlocks,
  //         files: {
  //           ...prevState.code.files,
  //           ...files,
  //         },
  //       },
  //     }));
  //   },
  //   []
  // );

  // const addChatMessage = useCallback((message: Message) => {
  //   setState((prevState) => ({
  //     ...prevState,
  //     chat: {
  //       ...prevState.chat,
  //       messages: [...prevState.chat.messages, message],
  //     },
  //   }));
  // }, []);

  // const updateMessages = useCallback(
  //   (updater: (prev: Message[]) => Message[]) => {
  //     setState((prevState) => ({
  //       ...prevState,
  //       chat: {
  //         ...prevState.chat,
  //         messages: updater(prevState.chat.messages),
  //       },
  //     }));
  //   },
  //   []
  // );

  // const updateRecommendedKeywords = useCallback((keywords: string[]) => {
  //   setState((prevState) => ({
  //     ...prevState,
  //     config: {
  //       ...prevState.config,
  //       recommendedKeywords: keywords,
  //     },
  //   }));
  // }, []);

  // const updateConfig = useCallback(
  //   (config: Partial<WorkspaceState["config"]>) => {
  //     setState((prevState) => ({
  //       ...prevState,
  //       config: {
  //         ...prevState.config,
  //         ...config,
  //       },
  //     }));
  //   },
  //   []
  // );

  // const toggleChatCollapse = useCallback(() => {
  //   setState((prevState) => ({
  //     ...prevState,
  //     config: {
  //       ...prevState.config,
  //       isChatCollapsed: !prevState.config.isChatCollapsed,
  //     },
  //   }));
  // }, []);

  // const resetState = useCallback((option: WorkspaceType) => {
  //   setState((prev) => {
  //     const newState = workspaceStateCreator.create(option);

  //     newState.ui.title = prev.ui.title;

  //     return newState;
  //   });
  // }, []);

  // const contextValue = useMemo(
  //   () => ({
  //     state,
  //     setActiveTab,
  //     updateCodeFiles,
  //     addChatMessage,
  //     updateMessages,
  //     updateRecommendedKeywords,
  //     toggleChatCollapse,
  //     updateConfig,
  //     resetState,
  //   }),
  //   [
  //     state,
  //     setActiveTab,
  //     updateCodeFiles,
  //     addChatMessage,
  //     updateMessages,
  //     updateRecommendedKeywords,
  //     toggleChatCollapse,
  //     updateConfig,
  //     resetState,
  //   ]
  // );

  return (
    <WorkspaceContext.Provider value={workspaceStore}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export default WorkspacePovider;
