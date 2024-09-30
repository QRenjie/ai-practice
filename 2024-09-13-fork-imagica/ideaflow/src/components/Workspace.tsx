import React from "react";
import { WorkspaceState } from "../context/WorkspaceContext";
import WorkspacePovider from "../container/WorkspacePovider";
import WorkspacePanel from "./WorkspacePanel";
import dynamic from "next/dynamic";

const Layer = dynamic(() => import("./Layer"));

const Workspace: React.FC<{
  index: number;
  state: WorkspaceState;
  onClose?: (id: string) => void;
}> = ({ state, onClose }) => {
  return (
    <WorkspacePovider key={state.id} initialState={state}>
      {state.config.useLayer ? (
        <Layer
          id={state.id}
          initialState={state.ui}
          onClose={() => onClose?.(state.id)}
          title={state.ui.title}
        >
          <WorkspacePanel />
        </Layer>
      ) : (
        <WorkspacePanel />
      )}
    </WorkspacePovider>
  );
};

export default Workspace;
