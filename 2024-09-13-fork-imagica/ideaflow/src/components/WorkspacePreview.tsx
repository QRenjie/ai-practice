import React, { useContext, useEffect, useRef } from "react";
import WorkspaceContext from "../context/WorkspaceContext";

const WorkspacePreview: React.FC = () => {
  const { state } = useContext(WorkspaceContext)!;
  const { mergedCodeBlocks } = state;
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const previewContent = mergedCodeBlocks.filter(block => block.language === 'html')?.[0]?.code;
    if (previewContent && iframeRef.current) {
      const blob = new Blob([previewContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      iframeRef.current.src = url;
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [mergedCodeBlocks]);

  return (
    <div className="w-full h-full overflow-auto">
      <iframe ref={iframeRef} className="w-full h-full border-none" sandbox="allow-scripts allow-same-origin"></iframe>
    </div>
  );
};

export default WorkspacePreview;