import React, { useContext } from "react";
import WorkspaceContext from "@/context/WorkspaceContext";
import {
  FiSettings,
  FiMessageSquare,
  FiCornerDownLeft,
  FiChevronUp,
  FiChevronDown,
  FiLoader,
} from "react-icons/fi";
import IconButton from "./common/IconButton"; // 导入 IconButton 组件
import { WorkspaceMoreAction } from "./WorkspaceMoreAction";

interface ChatFooterProps {
  openPanel: "none" | "messages" | "config";
  handleTogglePanel: (panel: "messages" | "config") => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onKeywordSelect: (keyword: string) => void;
}

export function CollapseChatFooterButton() {
  const { state, controller } = useContext(WorkspaceContext)!;

  return (
    <button
      className={`rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center justify-center ${
        state.config.isChatCollapsed ? "w-6 h-6" : "w-7 h-7"
      }`}
      onClick={() => controller.toggleChatCollapse()}
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

  const size = state.config.isChatCollapsed ? "sm" : "md"; // 使用 Tailwind 风格的尺寸

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
      <WorkspaceMoreAction iconSize={size} />
      <IconButton
        icon={<FiMessageSquare />}
        isActive={openPanel === "messages"}
        onClick={(e) => handleButtonClick(e, "messages")}
        title="聊天记录"
        size={size} // 使用 size 属性
      />
      <IconButton
        icon={<FiSettings />}
        isActive={openPanel === "config"}
        onClick={(e) => handleButtonClick(e, "config")}
        title="设置"
        size={size} // 使用 size 属性
      />
      <IconButton
        icon={
          isLoading ? (
            <FiLoader className="animate-spin" />
          ) : (
            <FiCornerDownLeft />
          )
        }
        isActive={!isLoading}
        onClick={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
        title="发送"
        disabled={isLoading}
        size={size} // 使用 size 属性
      />
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
