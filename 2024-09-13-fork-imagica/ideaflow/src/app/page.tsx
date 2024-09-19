"use client";

import { useState, useCallback, useMemo } from "react";
import LayerContainer from "../container/LayerContainer";
import CodeExecutor from '../components/CodeExecutor';
import Chat from "../components/Chat";

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

export default function Home() {
  const [previewContent, setPreviewContent] = useState<string>(""); // Updated type definition
  const [previewKey, setPreviewKey] = useState(0); // 添加 previewKey 状态
  const [pythonCode, setPythonCode] = useState<string>("");

  const handleUpdatePreview = useCallback(({ type, content }: { type: 'html' | 'python', content: string }) => {
    console.log(`Updating preview with ${type} content:`, content);
    if (type === 'python') {
      setPythonCode(content);
    } else {
      setPreviewContent(content);
      setPreviewKey((prevKey) => prevKey + 1);
    }
  }, []);

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
      size: { width: 600, height: 600 },
    },
    {
      id: "codeExecutor",
      title: "代码执行器",
      content: <CodeExecutor initialCode={pythonCode} initialLanguage="python" />,
      size: { width: 500, height: 450 },
    },
    {
      id: "aiChat",
      title: "AI 助手",
      content: <Chat onUpdatePreview={handleUpdatePreview} />,
      size: { width: 480, height: 500 },
    },
  ], [previewKey, previewContent, handleUpdatePreview, pythonCode]);

  return (
    <div className="h-screen bg-gradient-to-r from-blue-100 to-blue-300 relative" data-testid="Home">
      <LayerContainer layers={layers} />
    </div>
  );
}
