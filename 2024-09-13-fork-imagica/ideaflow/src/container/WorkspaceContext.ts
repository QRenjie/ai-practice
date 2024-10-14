import React from "react";
import workspaceConfig from "../../config/workspace.json";
import { WorkspaceState } from "@/types/workspace";
import { WorkspaceController } from "@/controllers/WorkspaceController";

export const workspaceOptions = Object.keys(workspaceConfig).map((key) => ({
  label: key,
  value: key,
}));

export interface WorkspaceContextType {
  state: WorkspaceState;
  controller: WorkspaceController;
}

const WorkspaceContext = React.createContext<WorkspaceContextType | null>(null);

export default WorkspaceContext;
