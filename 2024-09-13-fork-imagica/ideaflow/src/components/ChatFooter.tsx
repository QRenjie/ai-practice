import React, { useContext } from "react";
import WorkspaceContext from "@/context/WorkspaceContext";
import {
  FiSettings,
  FiMessageSquare,
  FiCornerDownLeft,
  FiChevronUp,
  FiChevronDown,
} from "react-icons/fi";

interface ChatFooterProps {
  openPanel: "none" | "messages" | "config";
  handleTogglePanel: (panel: "messages" | "config") => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export function CollapseChatFooterButton() {
  const { state, toggleChatCollapse } = useContext(WorkspaceContext)!;

  return (
    <button
      className={`rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center justify-center ${
        state.config.isChatCollapsed ? "w-6 h-6" : "w-7 h-7"
      }`}
      onClick={toggleChatCollapse}
      title={state.config.isChatCollapsed ? "展开聊天" : "折叠聊天"}
      type="button"
    >
      {state.config.isChatCollapsed ? <FiChevronUp /> : <FiChevronDown />}
    </button>
  );
}

function ChatFooter({
  openPanel,
  handleTogglePanel,
  handleSubmit,
  isLoading,
}: ChatFooterProps) {
  const { state } = useContext(WorkspaceContext)!;

  const getButtonClass = (panel: "messages" | "config") => {
    const baseClass =
      "p-1.5 rounded-full transition-colors duration-200 focus:outline-none flex items-center justify-center";
    const activeClass = "bg-blue-500 text-white hover:bg-blue-600";
    const inactiveClass = "bg-gray-200 text-gray-700 hover:bg-gray-300";
    return `${baseClass} ${openPanel === panel ? activeClass : inactiveClass}`;
  };

  const handleButtonClick = (
    e: React.MouseEvent,
    panel: "messages" | "config"
  ) => {
    e.preventDefault();
    e.stopPropagation();
    handleTogglePanel(panel);
  };

  return (
    <div className={`w-full flex justify-between items-center bg-gray-100 px-1`}>
      <div className="text-xs text-gray-400">
        <div>
          <span>{state.config.selectedModel}</span>
        </div>
      </div>

      <div className="flex gap-1.5 text-md ml-auto">
        <button
          className={getButtonClass("messages")}
          onClick={(e) => handleButtonClick(e, "messages")}
          title="聊天记录"
          type="button"
        >
          <FiMessageSquare />
        </button>
        <button
          className={getButtonClass("config")}
          onClick={(e) => handleButtonClick(e, "config")}
          title="设置"
          type="button"
        >
          <FiSettings />
        </button>

        <button
          className={`w-7 h-7 rounded-full bg-blue-500 text-white hover:bg-blue-600 flex items-center justify-center`}
          onClick={(e) => {
            e.preventDefault();
            handleSubmit(e);
          }}
          disabled={isLoading}
          title="发送"
          type="button"
        >
          <FiCornerDownLeft />
        </button>
        <CollapseChatFooterButton />
      </div>
    </div>
  );
}

export default ChatFooter;
