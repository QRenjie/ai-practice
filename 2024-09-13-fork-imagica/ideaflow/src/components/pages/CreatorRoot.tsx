'use client';
import { WorkspaceState } from "@/types/workspace";
import Workspace from "../workspace/Workspace";

export default function CreatorRoot({
  workspace,
}: {
  workspace: WorkspaceState;
}) {
  return (
    <div className="relative w-full h-full">
      <Workspace key={workspace.id} index={0} state={workspace} />
    </div>
  );
}
