import WorkspaceContext from "@/container/WorkspaceContext";
import { useContext } from "react";
import {
  FiMessageSquare,
  FiSettings,
  FiLoader,
  FiCornerDownLeft,
} from "react-icons/fi";
import {
  ChatFooterProps,
  CollapseChatFooterButton,
} from "../workspaceChat/ChatFooter";
import IconButton from "../common/IconButton";
import { WorkspaceMoreAction } from "./WorkspaceMoreAction";
import { useLocales } from "@/container/LocalesPovider";

export function ChatFooterActions({
  openPanel,
  handleTogglePanel,
  handleSubmit,
  isLoading,
}: ChatFooterProps) {
  const { state } = useContext(WorkspaceContext)!;
  const { t } = useLocales<"/creator">();

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
    <div
      data-testid="chat-footer-actions"
      className="flex gap-1.5 text-md ml-auto"
    >
      <WorkspaceMoreAction iconSize={size} />
      <IconButton
        tooltipProps={{
          title: t["workspace.actions.messages"],
        }}
        active={openPanel === "messages"}
        onClick={(e) => handleButtonClick(e, "messages")}
        title={t["workspace.actions.messages"]}
        size={size} // 使用 size 属性
      >
        <FiMessageSquare />
      </IconButton>
      <IconButton
        tooltipProps={{
          title: t["workspace.actions.config"],
        }}
        active={openPanel === "config"}
        onClick={(e) => handleButtonClick(e, "config")}
        title={t["workspace.actions.config"]}
        size={size} // 使用 size 属性
      >
        <FiSettings />
      </IconButton>
      <IconButton
        tooltipProps={{
          title: isLoading
            ? t["workspace.actions.loading"]
            : t["workspace.actions.send"],
        }}
        active={!isLoading}
        onClick={(e) => {
          e.preventDefault();
          handleSubmit(e);
        }}
        title={
          isLoading
            ? t["workspace.actions.loading"]
            : t["workspace.actions.send"]
        }
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
