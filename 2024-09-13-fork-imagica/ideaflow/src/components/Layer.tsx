import React, { useContext, useRef, useCallback } from "react";
import { Rnd } from "react-rnd";
import LayerHeader from "./LayerHeader";
import "./Layer.css"; // 引入 CSS 文件
import ActiveLayerContext from "../context/ActiveLayerContext"; // 更新导入路径
import useLayerPosition from "../hooks/useLayerPosition"; // 使用自定义钩子

// 静态计数器
let layerCounter = 0;

interface LayerProps {
  id?: string; // 将 id 属性变为可选
  children: React.ReactNode;
  initialSize?: { width: number; height: number };
  initialPosition?: { x: number; y: number };
  minWidth?: number;
  minHeight?: number;
  title?: string;
}

const Layer: React.FC<LayerProps> = ({
  id,
  children,
  initialSize = { width: 480, height: 600 },
  initialPosition = { x: 20, y: 20 },
  minWidth = 320,
  minHeight = 400,
  title = "Layer",
}) => {
  const {
    size,
    position,
    isMaximized,
    isMinimized,
    isAnimating,
    maxSize,
    setSize,
    setPosition,
    handleMaximize,
    handleMinimize,
    handleFit,
  } = useLayerPosition(initialSize, initialPosition);

  const { activeLayer, setActiveLayer } = useContext(ActiveLayerContext);

  // 使用 useRef 保存唯一 id
  const layerIdRef = useRef(id || `layer-${layerCounter++}`);
  const layerId = layerIdRef.current;

  const handleClick = useCallback(() => {
    setActiveLayer(layerId);
  }, [setActiveLayer, layerId]);

  const handleDragStop = useCallback((e: any, d: any) => {
    setPosition({ x: d.x, y: d.y });
  }, [setPosition]);

  const handleResize = useCallback((e: any, direction: any, ref: any, delta: any, position: any) => {
    setSize({
      width: ref.offsetWidth,
      height: ref.offsetHeight,
    });
    setPosition({ x: position.x, y: position.y });
  }, [setSize, setPosition]);

  return (
    <Rnd
      size={size}
      position={position}
      onDragStop={handleDragStop}
      onResize={handleResize}
      minWidth={minWidth}
      minHeight={40}
      maxWidth={maxSize.width}
      maxHeight={maxSize.height}
      bounds="parent"
      dragHandleClassName="draggable-handle"
      className={`shadow-2xl rounded-lg overflow-hidden bg-gradient-to-br from-purple-500 to-indigo-600 ${
        isMinimized ? "h-10" : ""
      } ${isAnimating ? "layer-animating" : ""} layer-resizable ${activeLayer === layerId ? 'active' : ''}`} // 添加动画类和可调整大小类
      data-testid="Layer"
      onClick={handleClick} // 添加点击事件
      style={{ zIndex: activeLayer === layerId ? 1000 : 'auto' }} // 动态设置 z-index
    >
      <div className="flex flex-col h-full bg-white bg-opacity-10 backdrop-blur-sm">
        <LayerHeader
          onFit={handleFit}
          onMinimize={handleMinimize}
          onMaximize={handleMaximize}
          isMinimized={isMinimized}
          isMaximized={isMaximized}
          title={title}
        />
        <div className={`flex-grow overflow-auto ${isMinimized ? 'hidden' : ''}`}>
          {children}
        </div>
      </div>
    </Rnd>
  );
};

Layer.displayName = "Layer"; // 添加 displayName

export default React.memo(Layer);