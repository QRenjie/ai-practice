import React, { useContext } from "react";
import WorkspaceContext, { WorkspaceState } from "../context/WorkspaceContext";
import WorkspacePovider from "../container/WorkspacePovider";
import WorkspacePanel from "./WorkspacePanel";
import dynamic from "next/dynamic";

const Layer = dynamic(() => import("./Layer"));

const WorkspaceInner: React.FC<{
  onClose?: (id: string) => void;
}> = ({ onClose }) => {
  const { state } = useContext(WorkspaceContext)!;

  return (
    <Layer
      id={state.id}
      initialState={state.ui}
      onClose={() => onClose?.(state.id)}
      title={state.ui.title}
      disabled={!state.config.isWindowed}
    >
      <WorkspacePanel />
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
