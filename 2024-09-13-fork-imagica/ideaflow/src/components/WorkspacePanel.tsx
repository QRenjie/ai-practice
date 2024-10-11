import React, { useContext } from "react";
import WorkspacePreview from "./WorkspacePreview";
import WorkspaceChat from "./WorkspaceChat";
import WorkspaceCode from "./WorkspaceCode";
import WorkspaceContext from "@/context/WorkspaceContext";
import WorkspaceSandpackWrapper from "./WorkspaceSandpackWrapper";
import WorkspaceLoadingSkeleton from "./WorkspaceLoadingSkeleton";
import ResizablePanel from "@/components/common/ResizablePanel";

const WorkspacePanel: React.FC = () => {
  const { state } = useContext(WorkspaceContext)!;
  const { isSandpackLoading } = state.config;

  return (
    <WorkspaceSandpackWrapper>
      <div
        data-testid="WorkspacePanel"
        className={`flex flex-col w-full h-full bg-gradient-to-br from-white to-gray-100 shadow-lg relative overflow-hidden ${
          isSandpackLoading ? "pointer-events-none" : ""
        }`}
      >
        {/* 顶部操作区 */}
        <div className="flex justify-between items-center bg-blue-200 p-2">
          <h2 className="text-lg font-semibold">工作区</h2>
        </div>

        <div
          data-testid="ResizablePanel"
          className={`flex-1 flex overflow-hidden relative ${
            isSandpackLoading ? "pointer-events-none" : ""
          }`}
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
