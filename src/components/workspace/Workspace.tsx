import React, { useContext } from "react";
import { WorkspaceState } from "@/types/workspace";
import WorkspacePovider from "@/container/WorkspacePovider";
import WorkspacePanel from "./WorkspacePanel";
import WorkspaceSelector from "./WorkspaceSelector"; // 新增导入
import dynamic from "next/dynamic";
import WorkspaceContext from "@/container/WorkspaceContext";

const Layer = dynamic(() => import("../Layer"), {
  ssr: false,
});

const WorkspaceInner: React.FC<{
  onClose?: () => void;
}> = ({ onClose }) => {
  const { state } = useContext(WorkspaceContext)!;

  const renderContent = () => {
    // 当template为空时，表示当前工作区为自定义工作区，需要展示工作区选择器
    if (!state.code.template) {
      return <WorkspaceSelector />;
    }
    return <WorkspacePanel />;
  };

  return (
    <Layer
      id={state.id}
      initialState={state.ui}
      onClose={onClose}
      title={state.ui.title}
      disabled={!state.config.isWindowed}
      // 为了给sandpack设置高度为100%, 否则只能通过 style 修改
      // className="flex flex-col"
      // renderHeader={WorkspaceHeader}
      renderHeader={() => null}
    >
      {renderContent()}
    </Layer>
  );
};

const Workspace: React.FC<{
  index: number;
  state: WorkspaceState;
  onClose?: (id: string) => void;
}> = ({ state, onClose }) => {
  return (
    <WorkspacePovider key={state.id} initialState={state}>
      <WorkspaceInner onClose={() => onClose?.(state.id)} />
    </WorkspacePovider>
  );
};

export default Workspace;
