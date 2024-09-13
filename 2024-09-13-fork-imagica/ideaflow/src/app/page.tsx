'use client';

import { useState, useRef, useEffect } from "react";
import Chat from "../components/Chat";

export default function Home() {
  const [previewContent, setPreviewContent] = useState<string>("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const handleUpdatePreview = (content: string) => {
    setPreviewContent(content);
  };

  useEffect(() => {
    if (iframeRef.current) {
      const iframeDocument = iframeRef.current.contentDocument;
      if (iframeDocument) {
        iframeDocument.open();
        iframeDocument.write(previewContent);
        iframeDocument.close();
      }
    }
  }, [previewContent]);

  return (
    <div className="flex h-screen">
      <div className="w-1/2 flex flex-col">
        <h2 className="text-2xl p-4 border-b">Chat</h2>
        <div className="flex-1 overflow-hidden">
          <Chat onUpdatePreview={handleUpdatePreview} />
        </div>
      </div>
      <div className="w-1/2 p-4 border-l overflow-y-auto">
        <h2 className="text-2xl mb-4">Preview</h2>
        <iframe
          ref={iframeRef}
          key={previewContent} // Add this line
          className="w-full h-[calc(100vh-8rem)] border"
          title="Preview"
        />
      </div>
    </div>
  );
}
