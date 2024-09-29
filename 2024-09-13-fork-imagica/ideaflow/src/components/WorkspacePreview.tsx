import React, { useContext, useEffect, useRef, useState } from "react";
import WorkspaceContext from "../context/WorkspaceContext";
import { codeRender } from "@/utils/CodeRender";
import JsxParser from "react-jsx-parser";
import clsx from "clsx";

const WorkspacePreview: React.FC = () => {
  const { state } = useContext(WorkspaceContext)!;
  const {
    preview: { codeBlock },
    code: { mergedCodeBlocks },
  } = state;
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (codeBlock && iframeRef.current) {
      // 文本渲染
      if (!(codeBlock.language === "jsx" || codeBlock.language === "tsx")) {
        const blob = new Blob([codeBlock.code], { type: "text/html" });
        blobUrlRef.current = URL.createObjectURL(blob);
        iframeRef.current.src = blobUrlRef.current;
      }
      // 组件渲染
    }
    return () => {
      blobUrlRef.current && URL.revokeObjectURL(blobUrlRef.current);
    };
  }, [codeBlock]);

  return (
    <div className="w-full h-full overflow-auto bg-white shadow-md flex items-center justify-center">
      {codeBlock && codeRender.isTsx(codeBlock) ? (
        <JsxParser jsx={codeBlock.code} />
      ) : null}
      <iframe
        ref={iframeRef}
        className="w-full h-full border-none"
        sandbox="allow-scripts allow-same-origin"
      ></iframe>

      <div
        className={clsx(
          "absolute top-0 left-0 w-full h-full bg-white flex flex-col items-center justify-center",
          codeBlock ? "hidden" : "block"
        )}
      >
        <h2 className="text-xl font-semibold">预览区域</h2>
        <p>内容将在这里显示</p>
      </div>
    </div>
  );
};

export default WorkspacePreview;
