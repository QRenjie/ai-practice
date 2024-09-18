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

  return (
    <div className="h-screen bg-gray-100 relative">
      <iframe
        key={previewKey}
        srcDoc={previewContent}
        className="w-full h-full border-none"
        title="Preview"
        sandbox="allow-scripts allow-modals"
        onLoad={() => console.log("iframe content loaded")}
      />
      <DraggableChat onUpdatePreview={handleUpdatePreview} />
    </div>
  );
}
