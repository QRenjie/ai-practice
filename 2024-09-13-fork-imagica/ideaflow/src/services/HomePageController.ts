import { WorkspaceState } from "@/types/workspace";
import { workspaceStateCreator } from "@/utils/WorkspaceStateCreator";
import { ContextMenuRef } from "@/components/ContextMenu";

export class HomePageController {
  private workspaces: WorkspaceState[] = [];
  private contextMenuRef: React.RefObject<ContextMenuRef> | null = null;
  private setWorkspacesState: React.Dispatch<React.SetStateAction<WorkspaceState[]>> | null = null;

  setWorkspaces = (workspaces: WorkspaceState[], setWorkspacesState: React.Dispatch<React.SetStateAction<WorkspaceState[]>>) => {
    this.workspaces = workspaces;
    this.setWorkspacesState = setWorkspacesState;
  };

  setContextMenuRef = (ref: React.RefObject<ContextMenuRef>) => {
    this.contextMenuRef = ref;
  };

  calculatePosition = (index: number) => {
    const offset = 30;
    const x = offset * index;
    const y = offset * index;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const maxX = screenWidth - 320;
    const maxY = screenHeight - 240;

    return { x: Math.min(x, maxX), y: Math.min(y, maxY) };
  };

  addWorkspace = () => {
    const newState = workspaceStateCreator.createSelector({
      ui: { title: `工作区 ${this.workspaces.length + 1}` },
    });

    const newInitPosition = this.calculatePosition(this.workspaces.length);
    newState.ui.position = newInitPosition;

    const newWorkspaces = [...this.workspaces, newState];
    this.workspaces = newWorkspaces;
    this.setWorkspacesState?.(newWorkspaces);
  };

  closeWorkspace = (id: string) => {
    const newWorkspaces = this.workspaces.filter((workspace) => workspace.id !== id);
    this.workspaces = newWorkspaces;
    this.setWorkspacesState?.(newWorkspaces);
  };

  getWorkspaces = () => {
    return this.workspaces;
  };

  handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    this.contextMenuRef?.current?.open({ x: event.clientX, y: event.clientY });
  };
}