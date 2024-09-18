import React, { useState, useEffect } from "react";
import Chat from "./Chat";
import { Rnd } from "react-rnd";

interface DraggableChatProps {
  onUpdatePreview: (content: string) => void;
}

export default function DraggableChat({ onUpdatePreview }: DraggableChatProps) {
  const [size, setSize] = useState({ width: 480, height: 600 });
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [maxSize, setMaxSize] = useState({ width: 800, height: 800 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const minWidth = 320;
  const minHeight = 400;

  useEffect(() => {
    const updateMaxSize = () => {
      setMaxSize({
        width: Math.max(window.innerWidth * 0.8, minWidth),
        height: Math.max(window.innerHeight * 0.8, minHeight),
      });
    };

    updateMaxSize();
    window.addEventListener('resize', updateMaxSize);

    return () => window.removeEventListener('resize', updateMaxSize);
  }, []);

  const handleMaximize = () => {
    if (isMaximized) {
      setSize({ width: 480, height: 600 });
      setPosition({ x: 20, y: 20 });
    } else {
      setSize({ width: maxSize.width, height: maxSize.height });
      setPosition({ x: 0, y: 0 });
    }
    setIsMaximized(!isMaximized);
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    if (isMinimized) {
      setSize({ width: 480, height: 600 });
    } else {
      setSize({ width: 480, height: 40 });
    }
    setIsMinimized(!isMinimized);
    setIsMaximized(false);
  };

  const handleFit = () => {
    setSize({ width: 480, height: 600 });
    setPosition({ x: 20, y: 20 });
    setIsMaximized(false);
    setIsMinimized(false);
  };

  return (
    <Rnd
      size={size}
      position={position}
      onDragStop={(e, d) => setPosition({ x: d.x, y: d.y })}
      onResize={(e, direction, ref, delta, position) => {
        setSize({
          width: ref.offsetWidth,
          height: ref.offsetHeight,
        });
        setPosition({ x: position.x, y: position.y });
      }}
      minWidth={minWidth}
      minHeight={isMinimized ? 40 : minHeight}
      maxWidth={maxSize.width}
      maxHeight={maxSize.height}
      bounds="parent"
      dragHandleClassName="draggable-handle"
      className="shadow-2xl rounded-lg overflow-hidden bg-gradient-to-br from-purple-500 to-indigo-600"
    >
      <div className="flex flex-col h-full bg-white bg-opacity-10 backdrop-blur-sm">
        <div className="draggable-handle cursor-move bg-black bg-opacity-30 p-2 rounded-t-lg flex justify-between items-center">
          <span className="text-white font-semibold">AI 助手</span>
          <div className="flex space-x-2">
            <button
              onClick={handleFit}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded p-1 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={handleMinimize}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded p-1 transition-colors duration-200"
            >
              {isMinimized ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 7a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 6a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            <button
              onClick={handleMaximize}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded p-1 transition-colors duration-200"
            >
              {isMaximized ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 3a1 1 0 011-1h10a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V3zm1 0v10h10V3H5z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V3zm1 1v10h10V4H4z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>
        {!isMinimized && (
          <div className="flex-grow overflow-auto">
            <Chat onUpdatePreview={onUpdatePreview} />
          </div>
        )}
      </div>
    </Rnd>
  );
}
