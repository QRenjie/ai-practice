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
  const [isCollapsed, setIsCollapsed] = useState(true);

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
    <div className="relative w-full">
      {/* 聊天输入框 */}
      <ChatInput
        inputRef={inputRef}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onKeyPress={handleKeyPress}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      {/* 悬浮显示聊天内容 */}
      {!isCollapsed && (
        <div className="absolute bottom-16 left-0 right-0 h-64 overflow-auto bg-white border border-gray-300 rounded-md shadow-lg z-50">
          <MessageList
            messages={state.chat.messages}
            chatController={chatController}
          />
        </div>
      )}
    </div>
  );
};

export default WorkspaceChat;
