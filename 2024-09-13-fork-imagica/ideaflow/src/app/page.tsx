"use client";

import { useCallback, useRef, useState } from "react";
import LayerProvider from "../container/LayerProvider";
import {
  WorkspaceState,
  workspaceStateCreator,
} from "@/context/WorkspaceContext";
import Workspace from "@/components/Workspace";
import ContextMenu, { ContextMenuRef } from "@/components/ContextMenu";

export default function Home() {
  const [workspaces, setWorkspaces] = useState<WorkspaceState[]>([
    workspaceStateCreator.createSelector({ ui: { title: "工作区1" } }),
  ]);

  const contextMenuRef = useRef<ContextMenuRef>(null);

  const calculatePosition = useCallback((index: number) => {
    const offset = 30; // 每个新 Layer 的偏移量
    const x = offset * index;
    const y = offset * index;

    // 获取屏幕宽度和高度
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // 确保新窗口不会超出屏幕范围
    const maxX = screenWidth - 320; // 假设窗口宽度为320
    const maxY = screenHeight - 240; // 假设窗口高度为240

    return { x: Math.min(x, maxX), y: Math.min(y, maxY) };
  }, []);

  const addWorkspace = useCallback(() => {
    setWorkspaces((prevWorkspaces) => {
      const newState = workspaceStateCreator.createSelector({
        ui: { title: `工作区 ${prevWorkspaces.length + 1}` },
      });

      // 使用 prevWorkspaces.length 计算新工作区的位置
      const newInintPosition = calculatePosition(prevWorkspaces.length);
      newState.ui.position = newInintPosition;

      return [...prevWorkspaces, newState];
    });
  }, [calculatePosition]);

  const closeWorkspace = useCallback((id: string) => {
    setWorkspaces((prevWorkspaces) =>
      prevWorkspaces.filter((workspace) => workspace.id !== id)
    );
  }, []);

  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    contextMenuRef.current?.open({ x: event.clientX, y: event.clientY });
  }, []);

  return (
    <div
      className="h-screen bg-gradient-to-r from-blue-100 to-blue-300 relative"
      data-testid="Home"
      onContextMenu={handleContextMenu}
    >
      <ContextMenu ref={contextMenuRef} onAddWorkspace={addWorkspace} />

      <LayerProvider>
        {workspaces.map((workspace, index) => (
          <Workspace
            key={workspace.id}
            index={index}
            state={workspace}
            onClose={closeWorkspace}
          />
        ))}
      </LayerProvider>
    </div>
  );
}
