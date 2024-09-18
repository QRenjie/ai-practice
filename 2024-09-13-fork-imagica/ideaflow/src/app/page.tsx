"use client";

import { useState } from "react";
import Chat from "../components/Chat";

export default function Home() {
  const [previewContent, setPreviewContent] = useState<string>("");
  const [previewKey, setPreviewKey] = useState(0);

  const handleUpdatePreview = (content: string) => {
    console.log("Updating preview with content:", content);
    setPreviewContent(content);
    setPreviewKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* 主内容区 */}
      <div className="flex-1 flex flex-col">

        {/* 聊天和预览区域 */}
        <div className="flex-1 flex overflow-hidden">
          {/* 聊天区域 */}
          <div className="w-1/2 flex flex-col bg-white m-4 rounded-lg shadow-lg overflow-hidden">
            <Chat onUpdatePreview={handleUpdatePreview} />
          </div>

          {/* 预览区域 */}
          <div className="w-1/2 flex flex-col bg-white m-4 rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-700">预览</h3>
            </div>
            <div className="flex-1 p-4">
              <iframe
                key={previewKey}
                srcDoc={previewContent}
                className="w-full h-full rounded-lg border border-gray-200"
                title="Preview"
                sandbox="allow-scripts allow-modals"
                onLoad={() => console.log("iframe content loaded")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
