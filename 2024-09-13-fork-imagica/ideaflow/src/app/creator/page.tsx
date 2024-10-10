'use client';

import ContextMenu, { ContextMenuRef } from "@/components/ContextMenu";
import Workspace from "@/components/Workspace";
import LayerProvider from "@/container/LayerProvider";
import { WorkspaceState, workspaceStateCreator } from "@/context/WorkspaceContext";
import { CreatorPageController } from "@/services/CreatorPageController";
import { useState, useMemo, useRef, useEffect } from "react";

export default function Creator() {
  const [workspaces, setWorkspaces] = useState<WorkspaceState[]>([
    workspaceStateCreator.createSelector({ ui: { title: "工作区1" } }),
  ]);

  const controller = useMemo(() => new CreatorPageController(), []);
  const contextMenuRef = useRef<ContextMenuRef>(null);

  useEffect(() => {
    controller.setWorkspaces(workspaces, setWorkspaces);
    controller.setContextMenuRef(contextMenuRef);
  }, [controller, workspaces]);

  return (
    <div
      className="h-screen bg-gradient-to-r from-blue-100 to-blue-300 relative"
      data-testid="CreatorPage"
      onContextMenu={controller.handleContextMenu}
    >
      <ContextMenu
        ref={contextMenuRef}
        onAddWorkspace={controller.addWorkspace}
      />

      <LayerProvider>
        {workspaces.map((workspace, index) => (
          <Workspace
            key={workspace.id}
            index={index}
            state={workspace}
            onClose={controller.closeWorkspace}
          />
        ))}
      </LayerProvider>
    </div>
  );
}
