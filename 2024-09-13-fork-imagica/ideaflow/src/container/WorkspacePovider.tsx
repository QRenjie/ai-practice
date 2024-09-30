import React, { useState, useCallback, useMemo, useEffect } from "react";
import WorkspaceContext, { WorkspaceState } from "../context/WorkspaceContext";
import { CodeBlock, Message } from "@/types/apiTypes";
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

  const updatePreviewCodeBlock = useCallback((codeBlock: CodeBlock) => {
    setState((prevState) => ({
      ...prevState,
      // 更新的同时将codeBlock添加到files 中的 src/MyComponent.js
      code: {
        ...prevState.code,
        codeBlock,
        files: {
          ...prevState.code.files,
          "App.js": codeBlock.code,
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
