import React from "react";
import Chat from "./Chat";
import Layer from "./Layer";

interface DraggableChatProps {
  onUpdatePreview: (content: string) => void;
}

export default function DraggableChat({ onUpdatePreview }: DraggableChatProps) {
  return (
    <Layer initialSize={{ width: 480, height: 600 }} initialPosition={{ x: 20, y: 20 }} title="AI 助手">
      <div className="flex flex-col h-full bg-white bg-opacity-10 backdrop-blur-sm">
        <div className="flex-grow overflow-auto">
          <Chat onUpdatePreview={onUpdatePreview} />
        </div>
      </div>
    </Layer>
  );
}
