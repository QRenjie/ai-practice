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
    <div className="flex flex-col h-screen bg-gradient-to-br from-teal-500 to-blue-600">
      <header className="bg-white bg-opacity-10 p-4 text-white">
        <h1 className="text-3xl font-bold">AI 代码助手</h1>
      </header>
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-1/2 p-4">
          <div className="flex flex-col bg-white bg-opacity-20 rounded-lg shadow-lg p-4 h-full">
            <div className="flex flex-1 flex-col h-full">
              <h2 className="text-2xl font-semibold text-white mb-4">对话</h2>
              <Chat onUpdatePreview={handleUpdatePreview} />
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2 p-4">
          <div className="bg-white bg-opacity-20 rounded-lg shadow-lg p-4 h-full">
            <h2 className="text-2xl font-semibold text-white mb-4">预览</h2>
            <iframe
              key={previewKey}
              srcDoc={previewContent}
              className="w-full h-[calc(100%-3rem)] rounded-lg border-2 border-white border-opacity-30"
              title="Preview"
              sandbox="allow-scripts allow-modals"
              onLoad={() => console.log("iframe content loaded")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
