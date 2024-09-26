import WorkspaceContext from "@/context/WorkspaceContext";
import React, { useContext } from "react";
import { FiSettings, FiMessageSquare, FiCornerDownLeft } from "react-icons/fi";

function ChatFooter({
  handleTogglePanel,
  openPanel,
  loading,
  handleSubmit,
}: {
  handleTogglePanel: (panel: "messages" | "config") => void;
  openPanel: string;
  loading?: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}) {
  const { state } = useContext(WorkspaceContext)!;
  const getButtonClass = (panel: "messages" | "config") => {
    const baseClass =
      "p-1.5 rounded-full transition-colors duration-200 focus:outline-none flex items-center justify-center";
    const activeClass = "bg-blue-500 text-white hover:bg-blue-600";
    const inactiveClass = "bg-gray-200 text-gray-700 hover:bg-gray-300";
    return `${baseClass} ${openPanel === panel ? activeClass : inactiveClass}`;
  };

  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.preventDefault();
    action();
  };

  return (
    <div className="w-full flex justify-between items-center bg-gray-100 px-1">
      <div className="text-xs text-gray-400">
        <div>
          <span>{state.config.selectedModel}</span>
        </div>
      </div>

      <div className="flex gap-1.5 text-md">
        <button
          className={getButtonClass("messages")}
          onClick={(e) =>
            handleButtonClick(e, () => handleTogglePanel("messages"))
          }
          title="聊天记录"
          type="button"
        >
          <FiMessageSquare />
        </button>
        <button
          className={getButtonClass("config")}
          onClick={(e) =>
            handleButtonClick(e, () => handleTogglePanel("config"))
          }
          title="设置"
          type="button"
        >
          <FiSettings />
        </button>
        <button
          className={`w-7 h-7 rounded-full transition-colors duration-200 focus:outline-none flex items-center justify-center ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
          onClick={(e) => handleButtonClick(e, () => handleSubmit(e))}
          disabled={loading}
          title="发送"
          type="button"
        >
          <FiCornerDownLeft />
        </button>
      </div>
    </div>
  );
}

export default ChatFooter;
