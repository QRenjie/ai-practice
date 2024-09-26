import React, { useState, useCallback, useMemo } from "react";
import WorkspaceContext, {
  defaultWorkspaceState,
  WorkspaceState,
} from "../context/WorkspaceContext";
import WorkspacePreview from "./WorkspacePreview";
import WorkspaceChat from "./WorkspaceChat";
import WorkspaceCodeHistory from "./WorkspaceCodeHistory"; // 新增导入
import { ApplyData } from "@/services/chatService";
import { CodeBlock, Message } from "@/types/apiTypes";

const WorkspacePanel: React.FC = () => {
  const [state, setState] = useState<WorkspaceState>(defaultWorkspaceState());

  const setActiveTab = useCallback((tab: WorkspaceState["ui"]["activeTab"]) => {
    setState((prevState) => ({
      ...prevState,
      ui: { ...prevState.ui, activeTab: tab },
    }));
  }, []);

  const updatePreview = useCallback((data: ApplyData) => {
    setState((prevState) => ({
      ...prevState,
      preview: {
        ...prevState.preview,
        content:
          data.type === "html" ? data.content : prevState.preview.content,
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

  const contextValue = useMemo(
    () => ({
      state,
      setActiveTab,
      updatePreview,
      addChatMessage,
      updateMessages,
      updateMergedCodeBlocks, // 新增方法
      updateRecommendedKeywords
    }),
    [
      state,
      setActiveTab,
      updatePreview,
      addChatMessage,
      updateMessages,
      updateMergedCodeBlocks,
      updateRecommendedKeywords
    ]
  );

  return (
    <WorkspaceContext.Provider value={contextValue}>
      <div className="flex flex-col h-full bg-gradient-to-br from-white to-gray-100 shadow-lg relative overflow-hidden">
        {/* 主要区域 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex border-b bg-blue-200">
            <TabButton
              active={state.ui.activeTab === "preview"}
              onClick={() => setActiveTab("preview")}
            >
              预览
            </TabButton>
            <TabButton
              active={state.ui.activeTab === "codeHistory"}
              onClick={() => setActiveTab("codeHistory")}
            >
              代码
            </TabButton>
          </div>
          <div className="flex-1 overflow-hidden relative">
            <div
              className={`absolute inset-0 transition-opacity duration-300 ${
                state.ui.activeTab === "preview"
                  ? "opacity-100 z-10"
                  : "opacity-0 z-0"
              }`}
            >
              <WorkspacePreview />
            </div>

            <div
              className={`absolute inset-0 transition-opacity duration-300 ${
                state.ui.activeTab === "codeHistory"
                  ? "opacity-100 z-10"
                  : "opacity-0 z-0"
              }`}
            >
              <WorkspaceCodeHistory />
            </div>
          </div>
        </div>

        {/* 底部区域 */}
        <div className="border-t bg-blue-200">
          <WorkspaceChat />
        </div>
      </div>
    </WorkspaceContext.Provider>
  );
};

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children }) => (
  <button
    className={`px-4 py-2 transition-colors duration-300 ${
      active ? "bg-white border-b-2 border-blue-500" : "hover:bg-blue-300"
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);

export default WorkspacePanel;
