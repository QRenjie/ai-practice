"use client";

import { useState } from "react";
import Chat from "../components/Chat";

export default function Home() {
  const [previewContent, setPreviewContent] = useState<string>("");
  const [previewKey, setPreviewKey] = useState(0);

  const handleUpdatePreview = (content: string) => {
    setPreviewContent(content);
    setPreviewKey((prevKey) => prevKey + 1);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen p-6 gap-6 bg-gradient-to-br from-purple-400 via-pink-500 to-red-500">
      <div className="w-full md:w-1/2 flex flex-col bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden">
        <h2 className="text-3xl font-bold p-6 text-center text-gray-800 border-b">
          智能对话
        </h2>
        <div className="flex-1 overflow-hidden">
          <Chat onUpdatePreview={handleUpdatePreview} />
        </div>
      </div>
      <div className="w-full md:w-1/2 flex flex-col bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden">
        <h2 className="text-3xl font-bold p-6 text-center text-gray-800 border-b">
          实时预览
        </h2>
        <div className="flex-1 p-6 overflow-hidden">
          <iframe
            key={previewKey}
            srcDoc={previewContent}
            className="w-full h-full border rounded-lg shadow-inner"
            title="Preview"
            sandbox="allow-scripts allow-forms allow-popups"
            onLoad={() => console.log("iframe content loaded")}
          />
        </div>
      </div>
    </div>
  );
}
