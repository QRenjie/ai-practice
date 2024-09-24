import React, {
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import WorkspaceContext from "../context/WorkspaceContext";
import { ChatController } from "../services/chatService";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

const WorkspaceChat: React.FC = () => {
  const workspaceContext = useContext(WorkspaceContext)!;
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { state } = workspaceContext;
  const [isCollapsed, setIsCollapsed] = useState(true); // 默认折叠

  const chatController = React.useMemo(() => {
    const controller = new ChatController(workspaceContext, setIsLoading);
    controller.setInputRef(inputRef);
    return controller;
  }, []);

  useEffect(() => {
    chatController.context = workspaceContext;
  }, [state]);

  const handleToggleCollapse = useCallback(() => {
    setIsCollapsed(!isCollapsed);
  }, [isCollapsed]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      chatController.handleSubmit(e);
    },
    [chatController]
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e as unknown as React.FormEvent);
      }
    },
    [handleSubmit]
  );

  return (
    <div className="bottom-0 left-0 right-0 w-full bg-gray-100 flex flex-col rounded-lg shadow-md">
      <div className={`absolute overflow-auto border-gray-300 p-4 bg-white bg-opacity-90 w-full bottom-[80px] h-2/3 ${isCollapsed ? "hidden" : 'block'}`}>
        <MessageList
          messages={state.chatMessages}
          chatController={chatController}
        />
      </div>
      {/* 聊天输入框始终显示，将折叠状态和切换函数传递给 ChatInput */}
      <div className="relative w-full border-t border-gray-300 p-4 bg-white bg-opacity-90">
        <ChatInput
          inputRef={inputRef}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          onKeyPress={handleKeyPress}
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />
      </div>
    </div>
  );
};

export default WorkspaceChat;
