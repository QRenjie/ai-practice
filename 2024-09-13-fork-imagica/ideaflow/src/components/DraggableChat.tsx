import { useState, useRef, useCallback, useEffect } from "react";
import Draggable from "react-draggable";
import Chat from "./Chat";

interface DraggableChatProps {
  onUpdatePreview: (content: string) => void;
}

export default function DraggableChat({ onUpdatePreview }: DraggableChatProps) {
  
  return (
    
      <div 
        className="absolute top-4 left-4 bg-white shadow-lg rounded-lg overflow-hidden"
      >
        <Chat onUpdatePreview={onUpdatePreview} />
      </div>
  );
}