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
import ChatFooter from "./ChatFooter";

const WorkspaceChat: React.FC = () => {
  const workspaceContext = useContext(WorkspaceContext)!;
  const inputRef = useRef<HTMLTextAreaElement>(null);
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
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e as unknown as React.FormEvent);
      }
    },
    [handleSubmit]
  );

  const handleKeywordSelect = useCallback((keyword: string) => {
    if (inputRef.current) {
      inputRef.current.value = keyword;
      handleTogglePanel("config");
      chatController.handleSubmit();
    }
  }, []);

  return (
    <form className="flex flex-col bg-gray-100 focus-within:ring-0 transition-all duration-300 p-1">
      <div className="w-full">
        <textarea
          ref={inputRef}
          name="chatInput"
          onKeyPress={handleKeyPress}
          className="w-full h-10 p-1 leading-5 overflow-y-auto resize-none text-sm text-gray-800 placeholder-gray-500 bg-gray-100 border-none focus:outline-none focus:ring-0 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-corner-neutral"
          placeholder="输入你的问题或按回车提交"
          disabled={isLoading}
          rows={2}
        />
      </div>
      <ChatFooter
        handleTogglePanel={handleTogglePanel}
        openPanel={openPanel}
        handleSubmit={handleSubmit}
        loading={isLoading} // 传递isLoading状态
      />
      <div
        className={`absolute bottom-16 left-16 right-2 h-2/3 overflow-hidden bg-white border-2 border-blue-300 rounded-lg shadow-lg transition-all duration-300
          ${openPanel !== "none" ? "z-20 opacity-100" : "-z-10 opacity-0"}
        `}
      >
        {openPanel === "config" && (
          <ConfigPanel onKeywordSelect={handleKeywordSelect} />
        )}
        {openPanel === "messages" && (
          <div className="h-full overflow-y-auto">
            <MessageList
              open={openPanel === "messages"}
              messages={state.chat.messages}
              chatController={chatController}
            />
          </div>
        )}
      </div>
    </form>
  );
};

export default WorkspaceChat;
