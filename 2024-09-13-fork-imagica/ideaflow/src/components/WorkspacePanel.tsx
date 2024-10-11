import React, { useContext } from "react";
import WorkspacePreview from "./WorkspacePreview";
import WorkspaceChat from "./WorkspaceChat";
import WorkspaceCode from "./WorkspaceCode";
import WorkspaceContext from "@/context/WorkspaceContext";
import WorkspaceSandpackWrapper from "./WorkspaceSandpackWrapper";
import WorkspaceLoadingSkeleton from "./WorkspaceLoadingSkeleton";
import ResizablePanel from "@/components/common/ResizablePanel";
import clsx from "clsx";

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
        {/* <div className="flex justify-between items-center bg-blue-200 p-2">
          <h2 className="text-lg font-semibold">工作区</h2>
        </div> */}

        <div
          data-testid="ResizablePanel"
          className={clsx("flex-1 flex overflow-hidden relative", {
            ["pointer-events-none"]: isSandpackLoading,
          })}
        >
          {/* 主要内容区 */}
          <ResizablePanel
            // 保持和骨架屏一致
            size={{ width: "68%" }}
            minSize={{ width: "10%" }}
            rightComponent={<WorkspaceCode />}
          >
            <WorkspacePreview />
          </ResizablePanel>
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
