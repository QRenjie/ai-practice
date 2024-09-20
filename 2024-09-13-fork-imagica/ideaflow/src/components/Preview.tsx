import React, { useContext } from 'react';
import WorkspaceContext from '../context/WorkspaceContext';

const Preview: React.FC = () => {
  const { state } = useContext(WorkspaceContext)!;

  return (
    <iframe
      srcDoc={state.previewContent || '<html><body><h2>预览区域</h2><p>内容将在这里显示</p></body></html>'}
      className="w-full h-full border-none"
      title="Preview"
      sandbox="allow-scripts allow-modals"
    />
  );
};

export default Preview;