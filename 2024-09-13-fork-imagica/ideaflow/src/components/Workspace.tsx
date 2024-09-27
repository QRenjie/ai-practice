import React from "react";
import { WorkspaceState } from "../context/WorkspaceContext";
import WorkspacePovider from "../container/WorkspacePovider";
import Layer from "./Layer";
import WorkspacePanel from "./WorkspacePanel";

const Workspace: React.FC<{
  index: number;
  state: WorkspaceState;
  onClose?: (id: string) => void;
}> = ({ state, onClose }) => {
  return (
    <WorkspacePovider key={state.id} initialState={state}>
      <Layer
        id={state.id}
        initialState={state.layer}
        onClose={() => onClose?.(state.id)}
        title={state.layer.title}
      >
        <WorkspacePanel />
      </Layer>
    </WorkspacePovider>
  );
};

export default Workspace;
