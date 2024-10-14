import WorkspaceContext from "@/container/WorkspaceContext";
import { useContext } from "react";
import {
  FiMessageSquare,
  FiSettings,
  FiLoader,
  FiCornerDownLeft,
} from "react-icons/fi";
import { ChatFooterProps, CollapseChatFooterButton } from "../ChatFooter";
import IconButton from "../common/IconButton";
import { WorkspaceMoreAction } from "./WorkspaceMoreAction";

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
        active={openPanel === "messages"}
        onClick={(e) => handleButtonClick(e, "messages")}
        title="聊天记录"
        size={size} // 使用 size 属性
      >
        <FiMessageSquare />
      </IconButton>
      <IconButton
        active={openPanel === "config"}
        onClick={(e) => handleButtonClick(e, "config")}
        title="设置"
        size={size} // 使用 size 属性
      >
        <FiSettings />
      </IconButton>
      <IconButton
        active={!isLoading}
        onClick={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
        title="发送"
        disabled={isLoading}
        size={size} // 使用 size 属性
      >
        {isLoading ? (
          <FiLoader className="animate-spin" />
        ) : (
          <FiCornerDownLeft />
        )}
      </IconButton>

      <CollapseChatFooterButton />
    </div>
  );
}
