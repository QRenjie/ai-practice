import React, { useContext } from "react";
import WorkspaceContext from "@/container/WorkspaceContext";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import { ChatFooterActions } from "./ChatFooterActions";
import IconButton from "../common/IconButton";
import { WorkspaceModelSelect } from "../workspace/WorkspaceModelSelect";
import { useLocales } from "@/container/LocalesPovider";

export interface ChatFooterProps {
  openPanel: "none" | "messages" | "config";
  handleTogglePanel: (panel: "messages" | "config") => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onKeywordSelect: (keyword: string) => void;
}

export function CollapseChatFooterButton() {
  const { state, controller } = useContext(WorkspaceContext)!;
  const { t } = useLocales<"/creator">();
  const size = state.config.isChatCollapsed ? "sm" : "md"; // 使用 Tailwind 风格的尺寸

  const title = state.config.isChatCollapsed
    ? t["workspace.actions.expand"]
    : t["workspace.actions.collapse"];
  return (
    <IconButton
      tooltipProps={{ title }}
      size={size}
      onClick={() => controller.store.toggleChatCollapse()}
      title={title}
    >
      {state.config.isChatCollapsed ? <FiChevronUp /> : <FiChevronDown />}
    </IconButton>
  );
}

function ChatFooter(props: ChatFooterProps) {
  const { onKeywordSelect } = props;
  const { state } = useContext(WorkspaceContext)!;
  const recommendedKeywords = state.config.recommendedKeywords;

  return (
    <div
      data-testid="chat-footer"
      className={`w-full flex flex-col bg-gray-100 px-1`}
    >
      <div className="flex justify-between items-center gap-1">
        <div className="text-xs text-gray-400">
          <WorkspaceModelSelect />
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
