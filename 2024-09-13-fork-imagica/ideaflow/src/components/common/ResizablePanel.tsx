import React, { useMemo, useState, useEffect } from "react";
import { Rnd } from "react-rnd";

type Size = { width?: number | string; height?: number | string };
interface ResizablePanelProps {
  children?: React.ReactNode;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  minSize?: Size;
  maxSize?: Size;
  size?: Size;
}

// 拖拽手柄
const DrgapElement = (
  <div className="absolute top-0 right-0 h-full w-2 bg-gray-300 cursor-col-resize hover:bg-gray-400"></div>
);

const ResizablePanel: React.FC<ResizablePanelProps> = ({
  children,
  leftComponent,
  rightComponent,
  minSize,
  maxSize,
  size,
}) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [panelWidth, setPanelWidth] = useState(size?.width || "50%");

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768); // 假设小于 768px 为小屏幕
      setPanelWidth(window.innerWidth < 768 ? "100%" : (size?.width || "50%"));
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [size]);

  const maxWidth = maxSize?.width || "100%";
  const enableResizing = useMemo(() => ({
    bottom: false,
    bottomLeft: false,
    bottomRight: false,
    left: false,
    right: !isSmallScreen,
    top: false,
    topLeft: false,
    topRight: false,
  }), [isSmallScreen]);

  const resizeHandleComponent = useMemo(() => {
    return {
      right: DrgapElement,
    };
  }, []);

  return (
    <div data-testid="ResizablePanel" className="w-full flex">
      {!isSmallScreen && leftComponent && (
        <div className="overflow-auto h-full flex-1">{leftComponent}</div>
      )}

      <Rnd
        default={{
          x: 0,
          y: 0,
          height: "100%",
          width: panelWidth,
        }}
        size={{ width: panelWidth, height: "100%" }}
        minWidth={isSmallScreen ? "100%" : minSize?.width}
        maxWidth={isSmallScreen ? "100%" : maxWidth}
        enableResizing={enableResizing}
        disableDragging={true}
        className="overflow-hidden h-full"
        style={{ position: "relative" }}
        resizeHandleComponent={resizeHandleComponent}
      >
        <div className="h-full relative">{children}</div>
      </Rnd>

      {!isSmallScreen && rightComponent && (
        <div className="overflow-auto h-full flex-1">{rightComponent}</div>
      )}
    </div>
  );
};

export default ResizablePanel;
