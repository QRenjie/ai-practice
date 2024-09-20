"use client";

import { useState } from "react";
import LayerContainer from "../container/LayerContainer";
import WorkspacePanel from '../components/WorkspacePanel';

export default function Home() {
  const [workspaces, setWorkspaces] = useState([
    { id: "workspace1", title: "工作区 1" },
  ]);

  const addWorkspace = () => {
    setWorkspaces(prevWorkspaces => [
      ...prevWorkspaces, 
      { 
        id: `workspace${prevWorkspaces.length + 1}`, 
        title: `工作区 ${prevWorkspaces.length + 1}` 
      }
    ]);
  };

  const closeWorkspace = (id: string) => {
    setWorkspaces(prevWorkspaces => prevWorkspaces.filter(workspace => workspace.id !== id));
  };

  const layers = workspaces.map(workspace => ({
    id: workspace.id,
    title: workspace.title,
    content: <WorkspacePanel />,
    size: { width: 600, height: 600 },
    onClose: () => closeWorkspace(workspace.id),
  }));

  return (
    <div className="h-screen bg-gradient-to-r from-blue-100 to-blue-300 relative" data-testid="Home">
      <button 
        onClick={addWorkspace} 
        className="absolute top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded z-10"
      >
        添加工作区
      </button>
      <LayerContainer layers={layers} />
    </div>
  );
}
