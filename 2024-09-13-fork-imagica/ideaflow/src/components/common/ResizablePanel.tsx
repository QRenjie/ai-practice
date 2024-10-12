import React, { useMemo, useState } from "react";
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
  const [width, setWidth] = useState(size?.width || '100%');
  const maxWidth = maxSize?.width || "100%";
  const enableResizing = useMemo(
    () => ({
      bottom: false,
      bottomLeft: false,
      bottomRight: false,
      left: false,
      right: true,
      top: false,
      topLeft: false,
      topRight: false,
    }),
    []
  );

  const resizeHandleComponent = useMemo(() => {
    return {
      right: DrgapElement,
    };
  }, []);

  return (
    <div data-testid="ResizablePanel" className="w-full flex">
      {/* {!isSmallScreen && leftComponent && (
        <div className="overflow-auto h-full flex-1">{leftComponent}</div>
      )} */}

      <Rnd
        size={{ width, height: "100%" }}
        minWidth={minSize?.width}
        maxWidth={maxWidth}
        enableResizing={enableResizing}
        disableDragging={true}
        className="overflow-hidden h-full"
        style={{ position: "relative" }}
        resizeHandleComponent={resizeHandleComponent}
        onResizeStop={(e, direction, ref, delta, position) => {
          setWidth(ref.style.width);
        }}
      >
        <div className="h-full relative">{children}</div>
      </Rnd>

      {/* {!isSmallScreen && rightComponent && (
        <div className="overflow-auto h-full flex-1">{rightComponent}</div>
      )} */}
    </div>
  );
};

export default ResizablePanel;
