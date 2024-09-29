import React, { useState, useCallback, useMemo, useEffect } from "react";
import WorkspaceContext, { WorkspaceState } from "../context/WorkspaceContext";
import { CodeBlock, Message } from "@/types/apiTypes";

const WorkspacePovider: React.FC<{
  initialState: WorkspaceState;
  children: React.ReactNode;
}> = ({ initialState, children }) => {
  const [state, setState] = useState<WorkspaceState>(initialState);

  useEffect(() => {
    setState(initialState);
  }, [initialState]);

  const setActiveTab = useCallback((tab: WorkspaceState["ui"]["activeTab"]) => {
    setState((prevState) => ({
      ...prevState,
      ui: { ...prevState.ui, activeTab: tab },
    }));
  }, []);

  const updatePreviewCodeBlock = useCallback((codeBlock: CodeBlock) => {
    setState((prevState) => ({
      ...prevState,
      preview: { ...prevState.preview, codeBlock },
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

  const updateMergedCodeBlocks = useCallback((blocks: CodeBlock[]) => {
    setState((prevState) => ({
      ...prevState,
      code: {
        ...prevState.code,
        mergedCodeBlocks: blocks,
      },
    }));
  }, []);

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
      updatePreviewCodeBlock,
      addChatMessage,
      updateMessages,
      updateMergedCodeBlocks,
      updateRecommendedKeywords,
      toggleChatCollapse,
    }),
    [
      state,
      setActiveTab,
      updatePreviewCodeBlock,
      addChatMessage,
      updateMessages,
      updateMergedCodeBlocks,
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
