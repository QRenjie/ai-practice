import React, { useState, useMemo, useEffect } from "react";
import { WorkspaceState } from "@/types/workspace";
import WorkspaceContext, {
  WorkspaceLocalState,
} from "@/container/WorkspaceContext";
import { WorkspaceController } from "@/controllers/WorkspaceController";
import { useCreation } from "ahooks";
import { workspaceService } from "@/services/WorkspaceService";

const WorkspacePovider: React.FC<{
  initialState: WorkspaceState;
  children: React.ReactNode;
}> = ({ initialState, children }) => {
  const [state, setState] = useState<WorkspaceState>(initialState);

  const [localState, setLocalState] = useState<WorkspaceLocalState>({
    stopPreviewMask: false,
  });

  const controller = useCreation(
    () =>
      new WorkspaceController(
        state,
        setState,
        localState,
        setLocalState,
        workspaceService
      ),
    []
  );

  useEffect(() => {
    setState(initialState);
  }, [initialState]);

  useEffect(() => {
    controller.state = state;
  }, [controller, state, localState]);

  useEffect(() => {
    controller.localState = localState;
  }, [controller, localState]);

  const contextValue = useMemo(
    () => ({
      state,
      controller,
      localState,
    }),
    [controller, state, localState]
  );

  return (
    <WorkspaceContext.Provider value={contextValue}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export default WorkspacePovider;
