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
import ConfigPanel from "./ConfigPanel";

const WorkspaceChat: React.FC = () => {
  const workspaceContext = useContext(WorkspaceContext)!;
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { state } = workspaceContext;
  const [openPanel, setOpenPanel] = useState<"none" | "messages" | "config">(
    "none"
  );

  const chatController = React.useMemo(() => {
    const controller = new ChatController(workspaceContext, setIsLoading);
    controller.setInputRef(inputRef);
    return controller;
  }, []);

  useEffect(() => {
    chatController.context = workspaceContext;
  }, [state]);

  const handleTogglePanel = useCallback((panel: "messages" | "config") => {
    setOpenPanel((prev) => (prev === panel ? "none" : panel));
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      chatController.handleSubmit();
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

  const getButtonClass = (panel: "messages" | "config") => {
    const baseClass =
      "px-3 py-2 rounded-md focus:outline-none transition-colors duration-200";
    const activeClass = "bg-blue-500 text-white hover:bg-blue-600";
    const inactiveClass = "bg-gray-200 text-gray-700 hover:bg-gray-300";
    return `${baseClass} ${openPanel === panel ? activeClass : inactiveClass}`;
  };

  const handleKeywordSelect = useCallback((keyword: string) => {
    if (inputRef.current) {
      inputRef.current.value = keyword;
      handleTogglePanel("config");
      chatController.handleSubmit();
    }
  }, []);

  return (
    <div className="w-full">
      <div className="flex items-center">
        <form
          onSubmit={handleSubmit}
          className="flex-grow flex items-center p-2 bg-white border-t border-gray-300"
        >
          <input
            ref={inputRef}
            type="text"
            name="chatInput"
            onKeyPress={handleKeyPress}
            className="flex-grow p-2 text-gray-800 placeholder-gray-500 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 rounded-md"
            placeholder="输入你的问题或按回车提交"
            disabled={isLoading}
          />
          <div className="flex items-center space-x-2 ml-2">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 disabled:bg-blue-300 transition-colors duration-300 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md"
              disabled={isLoading}
            >
              {isLoading ? "发送中..." : "发送"}
            </button>
            <button
              type="button"
              onClick={() => handleTogglePanel("messages")}
              className={getButtonClass("messages")}
            >
              对话
            </button>
            <button
              type="button"
              onClick={() => handleTogglePanel("config")}
              className={getButtonClass("config")}
            >
              配置
            </button>
          </div>
        </form>
      </div>

      <div
        className={`absolute bottom-16 left-16 right-2 h-2/3 overflow-hidden bg-white border-2 border-blue-300 rounded-lg shadow-lg transition-all duration-300
          ${openPanel === "messages" ? "z-20 opacity-100" : "-z-0 opacity-0"}
        `}
      >
        <div className="h-full overflow-y-auto">
          <MessageList
            open={openPanel === "messages"}
            messages={state.chat.messages}
            chatController={chatController}
          />
        </div>
      </div>

      <div
        className={`absolute bottom-16 left-16 right-2 h-2/3 overflow-hidden bg-white border-2 border-blue-300 rounded-lg shadow-lg transition-all duration-300
          ${openPanel === "config" ? "z-20 opacity-100" : "-z-0 opacity-0"}
        `}
      >
        <div className="h-full overflow-y-auto">
          <ConfigPanel onKeywordSelect={handleKeywordSelect} />
        </div>
      </div>
    </div>
  );
};

export default WorkspaceChat;
