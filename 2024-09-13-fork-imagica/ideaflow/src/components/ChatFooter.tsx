import React, { useContext } from "react";
import WorkspaceContext from "@/container/WorkspaceContext";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import DropdownMenu from "./common/DropdownMenu";
import modelsJson from "../../config/models.json";
import { ChatFooterActions } from "./workspace/ChatFooterActions";
import IconButton from "./common/IconButton";

export interface ChatFooterProps {
  openPanel: "none" | "messages" | "config";
  handleTogglePanel: (panel: "messages" | "config") => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onKeywordSelect: (keyword: string) => void;
}

export function CollapseChatFooterButton() {
  const { state, controller } = useContext(WorkspaceContext)!;
  const size = state.config.isChatCollapsed ? "sm" : "md"; // 使用 Tailwind 风格的尺寸

  return (
    <IconButton
      size={size}
      onClick={() => controller.toggleChatCollapse()}
      title={state.config.isChatCollapsed ? "展开聊天" : "折叠聊天"}
    >
      {state.config.isChatCollapsed ? <FiChevronUp /> : <FiChevronDown />}
    </IconButton>
  );
}

const models = Object.entries(modelsJson).map(([, value]) => ({
  value: value,
  label: value,
}));

function ChatFooter(props: ChatFooterProps) {
  const { onKeywordSelect } = props;
  const { state, controller } = useContext(WorkspaceContext)!;
  const recommendedKeywords = state.config.recommendedKeywords;

  return (
    <div className={`w-full flex flex-col bg-gray-100 px-1`}>
      <div className="flex justify-between items-center gap-1">
        <div className="text-xs text-gray-400">
          <DropdownMenu
            trigger={<span>{state.config.selectedModel}</span>}
            items={models}
            onChange={(value) => controller.updateConfig({ selectedModel: value })}
          />
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
