import WorkspaceContext from "@/context/WorkspaceContext";
import { useContext } from "react";

function ChatFooter({
  handleTogglePanel,
  openPanel,
}: {
  handleTogglePanel: (panel: "messages" | "config") => void;
  openPanel: string;
}) {
  const workspaceContext = useContext(WorkspaceContext)!;
  const { state } = workspaceContext;

  const getButtonClass = (panel: "messages" | "config") => {
    const baseClass =
      "px-1 py-0.5 rounded-md focus:outline-none transition-colors duration-200";
    const activeClass = "bg-blue-500 text-white hover:bg-blue-600";
    const inactiveClass = "bg-gray-200 text-gray-700 hover:bg-gray-300";
    return `${baseClass} ${openPanel === panel ? activeClass : inactiveClass}`;
  };

  return (
    <div className="w-full flex justify-between">
      <div>{/* <button>{state.config.selectedModel}</button> */}</div>
      <div>
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
        <button type="button">
          <span>发送</span>
          <kbd className="kbd kbd-xs">Enter</kbd>
        </button>
      </div>
    </div>
  );
}

export default ChatFooter;
