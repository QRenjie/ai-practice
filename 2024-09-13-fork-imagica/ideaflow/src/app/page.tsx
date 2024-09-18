"use client";

import { useState, useCallback } from "react";
import DraggableChat from "../components/DraggableChat";

export default function Home() {
  const [previewContent, setPreviewContent] = useState<string>("");
  const [previewKey, setPreviewKey] = useState(0);

  const handleUpdatePreview = useCallback((content: string) => {
    console.log("Updating preview with content:", content);
    setPreviewContent(content);
    setPreviewKey((prevKey) => prevKey + 1);
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
            background: linear-gradient(45deg, #f3f4f6 25%, transparent 25%, transparent 75%, #f3f4f6 75%, #f3f4f6),
                        linear-gradient(45deg, #f3f4f6 25%, transparent 25%, transparent 75%, #f3f4f6 75%, #f3f4f6);
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
    </html>
  `;

  return (
    <div className="h-screen bg-gray-100 relative">
      <iframe
        key={previewKey}
        srcDoc={previewContent || defaultIframeContent}
        className="w-full h-full border-none"
        title="Preview"
        sandbox="allow-scripts allow-modals"
        onLoad={() => console.log("iframe content loaded")}
      />
      <DraggableChat onUpdatePreview={handleUpdatePreview} />
    </div>
  );
}
