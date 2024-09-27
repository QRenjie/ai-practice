import React, { useContext } from "react";
import WorkspaceContext from "@/context/WorkspaceContext";
import {
  FiSettings,
  FiMessageSquare,
  FiCornerDownLeft,
  FiChevronUp,
  FiChevronDown,
  FiLoader, // 引入 FiLoader 图标
} from "react-icons/fi";

interface ChatFooterProps {
  openPanel: "none" | "messages" | "config";
  handleTogglePanel: (panel: "messages" | "config") => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onKeywordSelect: (keyword: string) => void;
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

export function ChatFooterActions({
  openPanel,
  handleTogglePanel,
  handleSubmit,
  isLoading,
}: ChatFooterProps) {
  const { state } = useContext(WorkspaceContext)!;

  const sizeClass = state.config.isChatCollapsed ? "w-6 h-6" : "w-7 h-7";

  const getButtonClass = (panel: "messages" | "config") => {
    const baseClass =
      "p-1.5 rounded-full transition-colors duration-200 focus:outline-none flex items-center justify-center";
    const activeClass = "bg-blue-500 text-white hover:bg-blue-600";
    const inactiveClass = "bg-gray-200 text-gray-700 hover:bg-gray-300";
    return `${baseClass} ${
      openPanel === panel ? activeClass : inactiveClass
    } ${sizeClass}`;
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
        className={`${sizeClass} rounded-full bg-blue-500 text-white hover:bg-blue-600 flex items-center justify-center`}
        onClick={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
        disabled={isLoading}
        title="发送"
        type="button"
      >
        {isLoading ? (
          <FiLoader className="animate-spin" /> // 使用 FiLoader 图标并添加旋转动画
        ) : (
          <FiCornerDownLeft />
        )}
      </button>
      <CollapseChatFooterButton />
    </div>
  );
}

function ChatFooter(props: ChatFooterProps) {
  const { onKeywordSelect } = props;
  const { state } = useContext(WorkspaceContext)!;
  const recommendedKeywords = state.config.recommendedKeywords;

  return (
    <div className={`w-full flex flex-col bg-gray-100 px-1`}>
      <div className="flex justify-between items-center gap-1">
        <div className="text-xs text-gray-400">
          <span>{state.config.selectedModel}</span>
        </div>

        {/* 显示推荐关键字 */}
        <div className="flex flex-1 flex-nowrap gap-2 text-[0.7rem] items-center overflow-x-auto no-scrollbar">
          {" "}
          {/* 添加 no-scrollbar 类 */}
          {recommendedKeywords.map((keyword, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onKeywordSelect(keyword)}
              className="py-1 px-0.5 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors duration-200 whitespace-nowrap" // 添加 whitespace-nowrap 类
            >
              {keyword.endsWith("?") ? `${keyword}` : `#${keyword}`}
            </button>
          ))}
        </div>

        <ChatFooterActions {...props} />
      </div>
    </div>
  );
}

export default ChatFooter;
