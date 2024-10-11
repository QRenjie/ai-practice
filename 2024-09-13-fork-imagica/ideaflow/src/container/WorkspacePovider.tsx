import React, { useState, useMemo, useEffect } from "react";
import { WorkspaceState } from "@/types/workspace";
import WorkspaceContext from "@/context/WorkspaceContext";
import { WorkspaceController } from "@/controllers/workspaceController";
import { useCreation } from "ahooks";

const WorkspacePovider: React.FC<{
  initialState: WorkspaceState;
  children: React.ReactNode;
}> = ({ initialState, children }) => {
  const [state, setState] = useState<WorkspaceState>(initialState);

  const controller = useCreation(
    () => new WorkspaceController(state, setState),
    []
  );

  useEffect(() => {
    setState(initialState);
  }, [initialState]);

  useEffect(() => {
    controller.state = state;
  }, [controller, state]);

  const contextValue = useMemo(
    () => ({
      state,
      controller,
    }),
    [controller, state]
  );

  return (
    <WorkspaceContext.Provider value={contextValue}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export default WorkspacePovider;
