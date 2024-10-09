import React, { useContext } from "react";
import WorkspacePreview from "./WorkspacePreview";
import WorkspaceChat from "./WorkspaceChat";
import WorkspaceCode from "./WorkspaceCode"; // 新增导入
import WorkspaceContext from "@/context/WorkspaceContext";
import WorkspaceSandpackWrapper from "./WorkspaceSandpackWrapper";
import WorkspaceLoadingSkeleton from "./WorkspaceLoadingSkeleton";
import { WorkspaceActions } from "./WorkspaceActions";

const WorkspacePanel: React.FC = () => {
  const { state, setActiveTab } = useContext(WorkspaceContext)!;
  const { isSandpackLoading } = state.config;

  

  return (
    <WorkspaceSandpackWrapper>
      <div
        data-testid="WorkspacePanel"
        className={`flex flex-col w-full h-full bg-gradient-to-br from-white to-gray-100 shadow-lg relative overflow-hidden ${
          isSandpackLoading ? "pointer-events-none" : ""
        }`}
      >
        {/* 主要区域 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex border-b bg-blue-200">
            <TabButton
              active={state.ui.activeTab === "preview"}
              onClick={() => setActiveTab("preview")}
              disabled={isSandpackLoading}
            >
              预览
            </TabButton>
            <TabButton
              active={state.ui.activeTab === "codeHistory"}
              onClick={() => setActiveTab("codeHistory")}
              disabled={isSandpackLoading}
            >
              代码
            </TabButton>
            <WorkspaceActions />
          </div>
          <div className="flex-1 overflow-hidden relative">
            <div
              className={`absolute inset-0 transition-opacity duration-300 ${
                state.ui.activeTab === "preview"
                  ? "opacity-100 z-10"
                  : "opacity-0 z-0"
              }`}
            >
              <WorkspacePreview />
            </div>

            <div
              className={`absolute inset-0 transition-opacity duration-300 ${
                state.ui.activeTab === "codeHistory"
                  ? "opacity-100 z-10"
                  : "opacity-0 z-0"
              }`}
            >
              <WorkspaceCode />
            </div>
          </div>
        </div>

        {/* 底部区域 */}
        <div className={`border-t bg-blue-200 transition-all duration-300`}>
          <WorkspaceChat />
        </div>

        {isSandpackLoading && <WorkspaceLoadingSkeleton />}
      </div>
    </WorkspaceSandpackWrapper>
  );
};

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}

const TabButton: React.FC<TabButtonProps> = ({
  active,
  onClick,
  children,
  disabled,
}) => (
  <button
    className={`px-4 py-2 transition-colors duration-300 ${
      active ? "bg-white border-b-2 border-blue-500" : "hover:bg-blue-300"
    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export default WorkspacePanel;
