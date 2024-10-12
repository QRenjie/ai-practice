import React, { useContext } from "react";
import WorkspaceChat from "./WorkspaceChat";
import WorkspaceContext from "@/context/WorkspaceContext";
import WorkspaceSandpackWrapper from "./WorkspaceSandpackWrapper";
import WorkspaceLoadingSkeleton from "./WorkspaceLoadingSkeleton";
import clsx from "clsx";
import WorkspaceHeader from "./WorkspaceHeader";
import WorkspaceContentArea from "./workspace/WorkspaceContentArea";

const WorkspacePanel: React.FC = () => {
  const { state } = useContext(WorkspaceContext)!;
  const { isSandpackLoading } = state.config;

  return (
    <WorkspaceSandpackWrapper style={{ height: "100%" }} className="h-full">
      <div
        data-testid="WorkspacePanel"
        className={clsx(
          // 使用 w-full 和 h-full 替代 flex-1 以避免高度塌陷
          "w-full h-full",
          "flex flex-col bg-gradient-to-br from-white to-gray-100 shadow-lg",
          {
            ["pointer-events-none"]: isSandpackLoading,
          }
        )}
      >
        {/* 顶部操作区 */}
        <WorkspaceHeader />

        <div
          className={clsx("flex-1 overflow-hidden relative", {
            ["pointer-events-none"]: isSandpackLoading,
          })}
        >
          <WorkspaceContentArea className="flex h-full" />
        </div>

        {/* 底部聊天区 */}
        <div className="border-t bg-blue-200">
          <WorkspaceChat />
        </div>

        {isSandpackLoading && <WorkspaceLoadingSkeleton />}
      </div>
    </WorkspaceSandpackWrapper>
  );
};

export default WorkspacePanel;
