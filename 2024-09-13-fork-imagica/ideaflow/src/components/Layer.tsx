import React, { useContext, useRef, useCallback } from "react";
import { Rnd, RndDragCallback, RndResizeCallback } from "react-rnd";
import LayerHeader from "./LayerHeader";
import ActiveLayerContext from "../context/ActiveLayerContext"; // 更新导入路径
import useLayerPosition from "../hooks/useLayerPosition"; // 使用自定义钩子

// 静态计数器
let layerCounter = 0;

type Size = { width: number | string; height: number | string };

export interface LayerState {
  title: string;
  size: Size;
  position: { x: number; y: number };
  isMaximized: boolean;
  isMinimized: boolean;
  maxSize: Size;
}

interface LayerProps {
  id?: string; // 将 id 属性变为可选
  children: React.ReactNode;
  initialState: LayerState;
  minWidth?: number;
  minHeight?: number;
  active?: boolean
  title?: string;
  onClose?: () => void; // 新增
}

const Layer: React.FC<LayerProps> = ({
  id,
  children,
  initialState,
  minWidth = 320,
  title = "Layer",
  onClose, // 新增
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
  } = useLayerPosition(initialState);

  const { activeLayer, setActiveLayer } = useContext(ActiveLayerContext);

  // 使用 useRef 保存唯一 id
  const layerIdRef = useRef(id || `layer-${layerCounter++}`);
  const layerId = layerIdRef.current;

  const handleClick = useCallback(() => {
    setActiveLayer(layerId);
  }, [setActiveLayer, layerId]);

  const handleDragStop: RndDragCallback = useCallback(
    (_, d) => {
      setPosition({ x: d.x, y: d.y });
    },
    [setPosition]
  );

  const handleResize: RndResizeCallback = useCallback(
    (_, __, ref, ___, position) => {
      setSize({
        width: ref.offsetWidth,
        height: ref.offsetHeight,
      });
      setPosition({ x: position.x, y: position.y });
    },
    [setSize, setPosition]
  );

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

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
      className={`
        shadow-2xl rounded-lg overflow-hidden
        bg-gradient-to-br from-gray-200 to-gray-300
        ${isMinimized ? "h-10" : ""}
        ${isAnimating ? "transition-all duration-300 ease-in-out" : ""}
        ${activeLayer === layerId ? "ring-2 ring-blue-500" : ""}
      `}
      data-testid="Layer"
      onClick={handleClick} // 添加点击事件
      style={{
        display: "flex",
        flexDirection: "column-reverse",
        zIndex: activeLayer === layerId ? 1000 : "auto",
      }} // 动态设置 z-index
    >
      <div
        date-testid="LayerMain"
        data-activelyayer={activeLayer === layerId}
        className="relative w-full h-full flex flex-col bg-white bg-opacity-10 backdrop-blur-sm"
      >
        <LayerHeader
          onFit={handleFit}
          onMinimize={handleMinimize}
          onMaximize={handleMaximize}
          onClose={handleClose} // 新增
          isMinimized={isMinimized}
          isMaximized={isMaximized}
          title={title}
        />
        <div className={`flex-1 ${isMinimized ? "hidden" : ""}`}>
          {children}
        </div>
      </div>
    </Rnd>
  );
};

Layer.displayName = "Layer"; // 添加 displayName

export default React.memo(Layer);
