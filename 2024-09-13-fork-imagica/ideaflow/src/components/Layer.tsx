import React, { useContext } from "react";
import { Rnd } from "react-rnd";
import LayerHeader from "./LayerHeader";
import {
  LayerContext,
  LayerProps,
  LayerProvider,
} from "../context/LayerContext"; // 更新导入路径
import clsx from "clsx";

type Size = { width: number | string; height: number | string };
const draggableHandleClassName = "draggable-handle";
export interface LayerState {
  title: string;
  size: Size;
  position: { x: number; y: number };
  isMaximized: boolean;
  isMinimized: boolean;
  maxSize: Size;
}

function LayerInner({ children }: { children?: React.ReactNode }) {
  const {
    minWidth,
    title,
    disabled,
    className,
    onClose,
    state,
    isAnimating,
    layerId,
    handleMaximize,
    handleMinimize,
    handleFit,
    handleClick,
    handleDragStop,
    handleResize,
    activeLayer,
  } = useContext(LayerContext)!;

  return (
    <Rnd
      size={state.size}
      position={state.position}
      onDragStop={handleDragStop}
      onResize={handleResize}
      minWidth={minWidth}
      minHeight={40}
      maxWidth={state.maxSize.width}
      maxHeight={state.maxSize.height}
      bounds="parent"
      dragHandleClassName={draggableHandleClassName}
      disableDragging={disabled}
      enableResizing={!disabled} // 添加这一行
      className={clsx(
        "shadow-2xl rounded-lg overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300",
        {
          ["h-10"]: state.isMaximized,
          ["transition-all duration-300 ease-in-out"]: isAnimating,
          ["ring-2 ring-blue-500"]: activeLayer === layerId,
        }
      )}
      data-testid="Layer"
      onClick={handleClick} // 添加点击事件
      style={{
        zIndex: activeLayer === layerId ? 1000 : "auto",
      }} // 动态设置 z-index
    >
      <div
        date-testid="LayerRoot"
        // className="relative w-full flex flex-col bg-white bg-opacity-10 backdrop-blur-sm"
        className="absolute inset-0"
        onContextMenu={(e) => e.stopPropagation()}
      >
        <div
          date-testid="LayerMain"
          className="relative h-full flex flex-col"
          data-activelyayer={activeLayer === layerId}
        >
          <LayerHeader
            className={draggableHandleClassName}
            onFit={handleFit}
            onMinimize={handleMinimize}
            onMaximize={handleMaximize}
            onClose={onClose} // 新增
            isMinimized={state.isMinimized}
            isMaximized={state.isMaximized}
            title={title}
          />
          <div
            data-testid="LayerBdoy"
            className={clsx("flex-1 overflow-y-auto", className, {
              // ["hidden"]: isMaximized,
            })}
          >
            {children}
          </div>
        </div>
      </div>
    </Rnd>
  );
}

export default function Layer({ children, ...props }: LayerProps) {
  return (
    <LayerProvider {...props}>
      <LayerInner>{children}</LayerInner>
    </LayerProvider>
  );
}
