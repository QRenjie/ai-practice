import React from 'react';
import Layer from './Layer';
import WorkspacePanel from './WorkspacePanel';

interface CombinedWindowProps {
  id: string;
  initialSize: { width: number; height: number };
  initialPosition: { x: number; y: number };
}

const CombinedWindow: React.FC<CombinedWindowProps> = ({ id, initialSize, initialPosition }) => {
  return (
    <Layer id={id} initialSize={initialSize} initialPosition={initialPosition} title="工作区面板">
      <WorkspacePanel />
    </Layer>
  );
};

export default CombinedWindow;