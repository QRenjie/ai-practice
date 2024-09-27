"use client";

import { useCallback, useState } from "react";
import LayerProvider from "../container/LayerProvider";
import {
  defaultWorkspaceState,
  WorkspaceState,
} from "@/context/WorkspaceContext";
import Workspace from "@/components/Workspace";

export default function Home() {
  const [workspaces, setWorkspaces] = useState<WorkspaceState[]>([
    defaultWorkspaceState({ id: "workspace1", layer: { title: "工作区 1" } }),
  ]);

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

  const addWorkspace = () => {
    setWorkspaces((prevWorkspaces) => {
      const newState = defaultWorkspaceState({
        id: `workspace${prevWorkspaces.length + 1}`,
        layer: { title: `工作区 ${prevWorkspaces.length + 1}` },
      });

      // 使用 prevWorkspaces.length 计算新工作区的位置
      const newInintPosition = calculatePosition(prevWorkspaces.length);
      newState.layer.position = newInintPosition;

      return [...prevWorkspaces, newState];
    });
  };

  const closeWorkspace = (id: string) => {
    setWorkspaces((prevWorkspaces) =>
      prevWorkspaces.filter((workspace) => workspace.id !== id)
    );
  };

  return (
    <div
      className="h-screen bg-gradient-to-r from-blue-100 to-blue-300 relative"
      data-testid="Home"
    >
      <button
        onClick={addWorkspace}
        className="absolute top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded z-10"
      >
        添加工作区
      </button>

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
