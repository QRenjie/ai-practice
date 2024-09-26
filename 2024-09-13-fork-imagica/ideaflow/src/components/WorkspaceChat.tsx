import React, {
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import WorkspaceContext from "../context/WorkspaceContext";
import { ChatController } from "../services/chatService";
import MessageList from "./MessageList";
import ConfigPanel from "./ConfigPanel";
import ChatFooter, { CollapseChatFooterButton } from "./ChatFooter";
import Popover from "./common/Popover";

const WorkspaceChat: React.FC = () => {
  const workspaceContext = useContext(WorkspaceContext)!;
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { state } = workspaceContext;
  const [openPanel, setOpenPanel] = useState<"none" | "messages" | "config">(
    "none"
  );

  const chatController = useMemo(() => {
    const controller = new ChatController(workspaceContext, setIsLoading);
    controller.setInputRef(inputRef);
    return controller;
  }, []);

  useEffect(() => {
    chatController.context = workspaceContext;
  }, [chatController, state, workspaceContext]);

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

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setOpenPanel("none");
    }
  }, []);

  const PopoverContent = useMemo(() => {
    if (openPanel === "config") {
      return (
        <div className="h-full overflow-y-auto">
          <ConfigPanel onKeywordSelect={handleKeywordSelect} />
        </div>
      );
    }

    if (openPanel === "messages") {
      return (
        <div className="h-full overflow-y-auto">
          <MessageList
            open={openPanel === "messages"}
            messages={state.chat.messages}
            chatController={chatController}
          />
        </div>
      );
    }

    return null;
  }, [chatController, handleKeywordSelect, openPanel, state.chat.messages]);

  return (
    <Popover
      overlayClassName="w-4/5 h-[40%] max-h-[66%]"
      relative
      placement="topRight"
      open={openPanel !== "none" && !state.config.isChatCollapsed}
      content={PopoverContent}
      onOpenChange={handleOpenChange}
      trigger="click"
    >
      <form
        className={`bg-gray-100 focus-within:ring-0 transition-all duration-300 ${
          state.config.isChatCollapsed ? "h-8 px-1" : "p-1"
        }`}
      >
        <div className="w-full h-full flex items-center justify-normal">
          <textarea
            ref={inputRef}
            name="chatInput"
            onKeyPress={handleKeyPress}
            className={`w-full p-1 leading-5 overflow-y-auto resize-none text-sm text-gray-800 placeholder-gray-500 bg-gray-100 border-none focus:outline-none focus:ring-0 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-corner-neutral ${
              state.config.isChatCollapsed ? "h-6" : "h-10"
            }`}
            placeholder="输入你的问题或按回车提交"
            disabled={isLoading}
            rows={1}
          />
          {state.config.isChatCollapsed && <CollapseChatFooterButton />}
        </div>
        {!state.config.isChatCollapsed && (
          <ChatFooter
            openPanel={openPanel}
            handleTogglePanel={handleTogglePanel}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
        )}
      </form>
    </Popover>
  );
};

export default WorkspaceChat;
