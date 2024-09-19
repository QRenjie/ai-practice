import React, { useState, useEffect, useCallback, useContext, useRef } from "react";
import { Rnd } from "react-rnd";
import LayerHeader from "./LayerHeader";
import "./Layer.css"; // 引入 CSS 文件

// 创建一个上下文来管理 activeLayer
const ActiveLayerContext = React.createContext({
  activeLayer: null,
  setActiveLayer: (id: string) => {},
});

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
  const [size, setSize] = useState(initialSize);
  const [position, setPosition] = useState(initialPosition);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [maxSize, setMaxSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  const { activeLayer, setActiveLayer } = useContext(ActiveLayerContext);

  // 使用 useRef 保存唯一 id
  const layerIdRef = useRef(id || `layer-${layerCounter++}`);
  const layerId = layerIdRef.current;

  useEffect(() => {
    const handleResize = () => {
      setMaxSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMaximize = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300); // 动画持续时间

    if (isMaximized) {
      setSize(initialSize);
      setPosition(initialPosition);
    } else {
      setSize({ width: maxSize.width, height: maxSize.height });
      setPosition({ x: 0, y: 0 });
    }
    setIsMaximized(!isMaximized);
    setIsMinimized(false);
  }, [isMaximized, initialSize, initialPosition, maxSize]);

  const handleMinimize = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300); // 动画持续时间

    if (isMinimized) {
      setSize(initialSize);
    } else {
      setSize({ width: initialSize.width, height: 40 });
    }
    setIsMinimized(!isMinimized);
    setIsMaximized(false);
  }, [isMinimized, initialSize]);

  const handleFit = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300); // 动画持续时间

    setSize(initialSize);
    setPosition(initialPosition);
    setIsMaximized(false);
    setIsMinimized(false);
  }, [initialSize, initialPosition]);

  const handleClick = () => {
    setActiveLayer(layerId);
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
export { ActiveLayerContext }; // 导出上下文