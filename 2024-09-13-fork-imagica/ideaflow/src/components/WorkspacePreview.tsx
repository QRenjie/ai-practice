import React, { useContext, useEffect, useRef, useState } from "react";
import WorkspaceContext from "../context/WorkspaceContext";
import AIService from "@/services/AIService";

const WorkspacePreview: React.FC = () => {
  const { state } = useContext(WorkspaceContext)!;
  const { mergedCodeBlocks } = state;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [previewContent, setPreviewContent] = useState<string>("");

  useEffect(() => {
    const codeBlock = mergedCodeBlocks.filter(block => block.language === 'html' || block.language === 'python')?.[0];

    if (codeBlock) {
      if (codeBlock.language === 'python') {
        const aiService = new AIService()
        aiService.execPythonCode(codeBlock)
          .then(({ result }) => {
            setPreviewContent(result);
          })
          .catch(error => {
            console.error('Error executing Python code:', error);
            setPreviewContent(`<p>Error executing Python code: ${error.message}</p>`);
          });
      } else {
        // HTML 内容直接设置
        setPreviewContent(codeBlock.code);
      }
    }
  }, [mergedCodeBlocks]);

  useEffect(() => {
    if (previewContent && iframeRef.current) {
      const blob = new Blob([previewContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      iframeRef.current.src = url;
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [previewContent]);

  return (
    <div className="w-full h-full overflow-auto bg-white rounded-lg shadow-md flex items-center justify-center">
      {previewContent ? (
        <iframe ref={iframeRef} className="w-full h-full border-none rounded-lg" sandbox="allow-scripts allow-same-origin"></iframe>
      ) : (
        <div className="text-center text-gray-500">
          <h2 className="text-xl font-semibold">预览区域</h2>
          <p>内容将在这里显示</p>
        </div>
      )}
    </div>
  );
};

export default WorkspacePreview;