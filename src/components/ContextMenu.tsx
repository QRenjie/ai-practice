import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
  useCallback,
} from "react";
import Popover from "./common/Popover";

interface ContextMenuProps {
  onAddWorkspace: () => void;
}

export interface ContextMenuRef {
  open: (pos: { x: number; y: number }) => void;
}

const ContextMenu = forwardRef<ContextMenuRef, ContextMenuProps>(
  ({ onAddWorkspace }, ref) => {
    const menuRef = useRef<HTMLDivElement>(null);
    const [contextMenu, setContextMenu] = useState<{
      x: number;
      y: number;
    } | null>(null);

    useImperativeHandle(ref, () => ({
      open: (pos: { x: number; y: number }) => {
        setContextMenu(pos);
      },
    }));

    const close = useCallback(() => {
      setContextMenu(null);
    }, []);

    return (
      <Popover
        content={
          <button
            onClick={() => {
              onAddWorkspace();
              close();
            }}
            className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
          >
            添加工作区
          </button>
        }
        placement="bottomLeft"
        open={!!contextMenu}
        onOpenChange={(open) => !open && close()}
        trigger={["contextMenu"]}
      >
        <div
          ref={menuRef}
          className="absolute"
          style={{ top: contextMenu?.y, left: contextMenu?.x }}
        />
      </Popover>
    );
  }
);

ContextMenu.displayName = "ContextMenu";

export default ContextMenu;
