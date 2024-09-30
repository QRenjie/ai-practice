import React, { useState, useCallback, useMemo, useEffect } from "react";
import WorkspaceContext, { WorkspaceState } from "../context/WorkspaceContext";
import { Message } from "@/types/apiTypes";
import workspaceConfig from "../../config/workspace.json";

const WorkspacePovider: React.FC<{
  initialState: WorkspaceState;
  children: React.ReactNode;
}> = ({ initialState, children }) => {
  const [state, setState] = useState<WorkspaceState>({
    ...initialState,
    code: {
      ...initialState.code,
      files: workspaceConfig.defaultConfig.code.files,
      template: "react",
    },
  });

  useEffect(() => {
    setState(initialState);
  }, [initialState]);

  const setActiveTab = useCallback((tab: WorkspaceState["ui"]["activeTab"]) => {
    setState((prevState) => ({
      ...prevState,
      ui: { ...prevState.ui, activeTab: tab },
    }));
  }, []);

  const updateCodeFiles = useCallback((files: WorkspaceState["code"]["files"]) => {
    setState((prevState) => ({
      ...prevState,
      code: {
        ...prevState.code,
        files: {
          ...prevState.code.files,
          ...files,
        },
      },
    }));
  }, []);

  const addChatMessage = useCallback((message: Message) => {
    setState((prevState) => ({
      ...prevState,
      chat: {
        ...prevState.chat,
        messages: [...prevState.chat.messages, message],
      },
    }));
  }, []);

  const updateMessages = useCallback(
    (updater: (prev: Message[]) => Message[]) => {
      setState((prevState) => ({
        ...prevState,
        chat: {
          ...prevState.chat,
          messages: updater(prevState.chat.messages),
        },
      }));
    },
    []
  );

  const updateRecommendedKeywords = useCallback((keywords: string[]) => {
    setState((prevState) => ({
      ...prevState,
      config: {
        ...prevState.config,
        recommendedKeywords: keywords,
      },
    }));
  }, []);

  const toggleChatCollapse = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      config: {
        ...prevState.config,
        isChatCollapsed: !prevState.config.isChatCollapsed,
      },
    }));
  }, []);

  const contextValue = useMemo(
    () => ({
      state,
      setActiveTab,
      updateCodeFiles,
      addChatMessage,
      updateMessages,
      updateRecommendedKeywords,
      toggleChatCollapse,
    }),
    [
      state,
      setActiveTab,
      updateCodeFiles,
      addChatMessage,
      updateMessages,
      updateRecommendedKeywords,
      toggleChatCollapse,
    ]
  );

  return (
    <WorkspaceContext.Provider value={contextValue}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export default WorkspacePovider;
