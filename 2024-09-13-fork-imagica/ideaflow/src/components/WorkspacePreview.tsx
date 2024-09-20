import React, { useContext } from 'react';
import WorkspaceContext from '../context/WorkspaceContext';

const WorkspacePreview: React.FC = () => {
  const { state } = useContext(WorkspaceContext)!;

  return (
    <div className="h-full bg-white">
      <iframe
        srcDoc={state.previewContent || '<html><body><h2 style="font-family: sans-serif; color: #4a5568;">预览区域</h2><p style="font-family: sans-serif; color: #718096;">内容将在这里显示</p></body></html>'}
        className="w-full h-full border-none"
        title="Preview"
        sandbox="allow-scripts allow-modals"
      />
    </div>
  );
};

export default WorkspacePreview;