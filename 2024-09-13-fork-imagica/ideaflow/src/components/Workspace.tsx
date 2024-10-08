import React from "react";
import WorkspaceContext, { WorkspaceState } from "@/context/WorkspaceContext";
import WorkspacePovider from "../container/WorkspacePovider";
import WorkspacePanel from "./WorkspacePanel";
import WorkspaceSelector from "./WorkspaceSelector"; // 新增导入
import dynamic from "next/dynamic";

const Layer = dynamic(() => import("./Layer"));

const WorkspaceInner: React.FC<{
  onClose?: (id: string) => void;
}> = ({ onClose }) => {
  const { state } = React.useContext(WorkspaceContext)!;

  const renderContent = () => {
    if (!state.code.template) {
      return <WorkspaceSelector />;
    }
    return <WorkspacePanel />;
  };

  return (
    <Layer
      id={state.id}
      initialState={state.ui}
      onClose={() => onClose?.(state.id)}
      title={state.ui.title}
      disabled={!state.config.isWindowed}
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
      <WorkspaceInner onClose={onClose} />
    </WorkspacePovider>
  );
};

export default Workspace;
