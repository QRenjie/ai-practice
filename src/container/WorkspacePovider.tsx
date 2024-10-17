import React, { useState, useMemo, useEffect } from "react";
import { WorkspaceState } from "@/types/workspace";
import WorkspaceContext, {
  WorkspaceLocalState,
} from "@/container/WorkspaceContext";
import { WorkspaceController } from "@/controllers/WorkspaceController";
import { useCreation } from "ahooks";
import { workspaceService } from "@/services/WorkspaceService";
import { workspaceStateCreator } from "@/utils/WorkspaceStateCreator";
import { WorkspaceStore } from "@/store/WorkspaceStore";
import { useLocales } from "./LocalesPovider";

const WorkspacePovider: React.FC<{
  initialState: WorkspaceState;
  children: React.ReactNode;
}> = ({ initialState, children }) => {
  const [state, setState] = useState<WorkspaceState>(initialState);
  const { locales } = useLocales<"/creator">();
  const [localState, setLocalState] = useState<WorkspaceLocalState>({
    stopPreviewMask: false,
  });

  const store = useCreation(
    () =>
      new WorkspaceStore(
        state,
        setState,
        localState,
        setLocalState,
        workspaceStateCreator
      ),
    []
  );
  const controller = useCreation(
    () => new WorkspaceController(store, workspaceService, locales),
    []
  );

  useEffect(() => {
    setState(initialState);
  }, [initialState]);

  useEffect(() => {
    store.state = state;
  }, [store, state]);

  useEffect(() => {
    store.localState = localState;
  }, [store, localState]);

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
