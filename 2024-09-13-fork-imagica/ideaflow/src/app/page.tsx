"use client";

import { useState, useCallback, useMemo } from "react";
import LayerContainer from "../container/LayerContainer";
import CodeExecutor from '../components/CodeExecutor';
import Chat from "../components/Chat";

export default function Home() {
  const [previewContent, setPreviewContent] = useState<string>(""); // Updated type definition
  const [previewKey, setPreviewKey] = useState(0); // 添加 previewKey 状态

  const handleUpdatePreview = useCallback((content: string) => {
    console.log("Updating preview with content:", content);
    setPreviewContent(content);
    setPreviewKey((prevKey) => prevKey + 1); // 更新 previewKey
  }, []);

  const defaultIframeContent = `
    <html>
      <head>
        <style>
          body {
            margin: 0;
            padding: 0;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            background: linear-gradient(45deg, #f3f4f6 25%, transparent 25%, transparent 75%, #f3f4f6 75%, #f3f4f6);
            background-size: 60px 60px;
            background-position: 0 0, 30px 30px;
            font-family: Arial, sans-serif;
          }
          .placeholder {
            text-align: center;
            color: #6b7280;
          }
        </style>
      </head>
      <body>
        <div class="placeholder">
          <h2>预览区域</h2>
          <p>内容将在这里显示</p>
        </div>
      </body>
    </html>`;

  const layers = useMemo(() => [
    {
      id: "preview",
      title: "预览",
      content: (
        <iframe
          key={previewKey}
          srcDoc={previewContent || defaultIframeContent}
          className="w-full h-full border-none"
          title="Preview"
          sandbox="allow-scripts allow-modals"
          onLoad={() => console.log("iframe content loaded")}
        />
      ),
      size: { width: 600, height: 400 },
    },
    {
      id: "codeExecutor",
      title: "代码执行器",
      content: <CodeExecutor />,
      size: { width: 500, height: 600 },
    },
    {
      id: "aiChat",
      title: "AI 助手",
      content: <Chat onUpdatePreview={handleUpdatePreview} />,
      size: { width: 480, height: 600 },
    },
  ], [previewKey, previewContent, handleUpdatePreview]);

  return (
    <div className="h-screen bg-gray-100 relative" data-testid="Home">
      <LayerContainer layers={layers} />
    </div>
  );
}
