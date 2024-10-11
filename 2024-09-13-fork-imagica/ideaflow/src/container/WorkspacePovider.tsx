import React, { useState, useMemo, useEffect } from "react";
import { WorkspaceState } from "@/types/workspace";
import WorkspaceContext from "@/context/WorkspaceContext";
import { WorkspaceController } from "@/controllers/workspaceController";
import { useCreation } from "ahooks";
import { WorkspaceStore } from "@/store/WorkspaceStore";
import { workspaceStateCreator } from "@/utils/WorkspaceStateCreator";

const WorkspacePovider: React.FC<{
  initialState: WorkspaceState;
  children: React.ReactNode;
}> = ({ initialState, children }) => {

  const store = useCreation(
    () => new WorkspaceStore(workspaceStateCreator),
    []
  );
  const controller = useCreation(
    () => new WorkspaceController(store),
    [store]
  );

  useEffect(() => {
    store.emit(initialState);
  }, [initialState]);


  const contextValue = useMemo(
    () => ({
      state: store.state,
      controller,
    }),
    [controller, store.state]
  );

  return (
    <WorkspaceContext.Provider value={contextValue}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export default WorkspacePovider;
