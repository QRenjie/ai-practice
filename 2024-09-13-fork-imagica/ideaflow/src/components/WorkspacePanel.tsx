import React, { useState, useCallback, useMemo } from "react";
import WorkspaceContext, { WorkspaceState } from "../context/WorkspaceContext";
import WorkspacePreview from "./WorkspacePreview";
import WorkspaceChat from "./WorkspaceChat";
import WorkspaceCodeHistory from "./WorkspaceCodeHistory"; // 新增导入
import { ApplyData, ChatHistory } from "@/services/chatService";
import { CodeBlock, Message } from "@/types/apiTypes";

const WorkspacePanel: React.FC = () => {
  const [state, setState] = useState<WorkspaceState>({
    activeTab: "chat",
    previewContent: "",
    chatHistory: [],
    chatMessages: [],
    mergedCodeBlocks: [], // 初始化状态
  });

  const setActiveTab = useCallback((tab: WorkspaceState["activeTab"]) => {
    setState((prevState) => ({ ...prevState, activeTab: tab }));
  }, []);

  const updatePreview = useCallback((data: ApplyData) => {
    setState((prevState) => ({
      ...prevState,
      previewContent:
        data.type === "html" ? data.content : prevState.previewContent,
    }));
  }, []);

  const addChatMessage = useCallback((message: Message) => {
    setState((prevState) => ({
      ...prevState,
      chatMessages: [...prevState.chatMessages, message],
    }));
  }, []);

  const updateChatHistory = useCallback((history: ChatHistory[]) => {
    setState((prevState) => ({ ...prevState, chatHistory: history }));
  }, []);

  const updateMessages = useCallback(
    (updater: (prev: Message[]) => Message[]) => {
      setState((prevState) => ({
        ...prevState,
        chatMessages: updater(prevState.chatMessages),
      }));
    },
    []
  );

  const updateMergedCodeBlocks = useCallback((blocks: CodeBlock[]) => {
    setState((prevState) => ({
      ...prevState,
      mergedCodeBlocks: blocks,
    }));
  }, []);

  const contextValue = useMemo(
    () => ({
      state,
      setActiveTab,
      updatePreview,
      addChatMessage,
      updateChatHistory,
      updateMessages,
      updateMergedCodeBlocks, // 新增方法
    }),
    [
      state,
      setActiveTab,
      updatePreview,
      addChatMessage,
      updateChatHistory,
      updateMessages,
      updateMergedCodeBlocks,
    ]
  );

  return (
    <WorkspaceContext.Provider value={contextValue}>
      <div className="flex flex-col h-full bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex border-b bg-gray-100">
          <TabButton
            active={state.activeTab === "preview"}
            onClick={() => setActiveTab("preview")}
          >
            预览
          </TabButton>
          <TabButton
            active={state.activeTab === "chat"}
            onClick={() => setActiveTab("chat")}
          >
            聊天
          </TabButton>
          <TabButton
            active={state.activeTab === "codeHistory"}
            onClick={() => setActiveTab("codeHistory")}
          >
            代码
          </TabButton>
        </div>
        <div className="flex-1 overflow-hidden relative">
          <div
            className={`absolute inset-0 ${
              state.activeTab === "preview" ? "block" : "hidden"
            }`}
          >
            <WorkspacePreview />
          </div>
          <div
            className={`absolute inset-0 ${
              state.activeTab === "chat" ? "block" : "hidden"
            }`}
          >
            <WorkspaceChat />
          </div>
          <div
            className={`absolute inset-0 ${
              state.activeTab === "codeHistory" ? "block" : "hidden"
            }`}
          >
            <WorkspaceCodeHistory />
          </div>
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
    className={`px-4 py-2 ${
      active ? "bg-white border-b-2 border-blue-500" : "hover:bg-gray-200"
    }`}
    onClick={onClick}
  >
    {children}
  </button>
);

export default WorkspacePanel;
