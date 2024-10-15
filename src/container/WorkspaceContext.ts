import React from "react";
import { WorkspaceState } from "@/types/workspace";
import { WorkspaceController } from "@/controllers/WorkspaceController";

export interface WorkspaceLocalState {
  stopPreviewMask: boolean;
}

export interface WorkspaceContextType {
  state: WorkspaceState;
  controller: WorkspaceController;
  localState: WorkspaceLocalState;
}

const WorkspaceContext = React.createContext<WorkspaceContextType | null>(null);

export default WorkspaceContext;
