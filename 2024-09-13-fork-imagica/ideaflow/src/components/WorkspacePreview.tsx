import React, { useContext, useEffect, useRef, useState } from "react";
import WorkspaceContext from "../context/WorkspaceContext";

const WorkspacePreview: React.FC = () => {
  const { state } = useContext(WorkspaceContext)!;
  const {
    preview: { codeBlock },
  } = state;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    if (codeBlock) {
      setIframeKey(prev => prev + 1);
    }
  }, [codeBlock]);

  const renderContent = () => {
    if (!codeBlock) {
      return (
        <div className="absolute top-0 left-0 w-full h-full bg-white flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold">预览区域</h2>
          <p>内容将在这里显示</p>
        </div>
      );
    }

    const encodedCodeBlock = encodeURIComponent(JSON.stringify(codeBlock));
    const iframeSrc = `/render?code=${encodedCodeBlock}`;

    return (
      <iframe
        key={iframeKey}
        ref={iframeRef}
        src={iframeSrc}
        className="w-full h-full border-none"
        sandbox="allow-scripts allow-same-origin"
      />
    );
  };

  return (
    <div className="w-full h-full overflow-auto bg-white shadow-md flex items-center justify-center">
      {renderContent()}
    </div>
  );
};

export default WorkspacePreview;
