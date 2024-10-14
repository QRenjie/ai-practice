import React, { useState } from "react";
import Popover from "./Popover";

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: {
    value: string;
    label: React.ReactNode;
    onClick?: () => void;
  }[];
  onChange?: (key: string) => void;
  /**
   * 该属性需要继承 Popover 组件
   */
  as?: React.ElementType; // 新增 as 属性
}

function DropdownMenu({
  trigger,
  items,
  onChange,
  as: Component = Popover,
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);

  const content = (
    <div className="py-1">
      {items.map((item) => (
        <button
          key={item.value}
          onClick={() => {
            item.onClick?.();
            setOpen(false);
            onChange?.(item.value);
          }}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        >
          {item.label}
        </button>
      ))}
    </div>
  );

  return (
    <Component
      content={content}
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      placement="bottomLeft"
      overlayClassName="shadow-lg rounded-md border border-gray-200"
      arrow={false}
    >
      {trigger}
    </Component>
  );
}

export default DropdownMenu;
