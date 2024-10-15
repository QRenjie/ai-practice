"use client";
import { WorkspaceState } from "@/types/workspace";
import Workspace from "../workspace/Workspace";
import { ActiveLayerProvider } from "@/container/ActiveLayerContext";

export default function CreatorRoot({
  workspace,
}: {
  workspace: WorkspaceState;
}) {
  return (
    <ActiveLayerProvider defaultActiveLayer={workspace.id}>
      <div className="relative w-full h-full overflow-hidden">
        <Workspace key={workspace.id} index={0} state={workspace} />
      </div>
    </ActiveLayerProvider>
  );
}
