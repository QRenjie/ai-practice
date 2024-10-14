import React, { forwardRef, useCallback, useState } from "react";
import Popover from "./Popover";
import { FiLoader } from "react-icons/fi";
import clsx from "clsx";
export interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: (DropdownMenuItemProps & { key: string })[];
  onChange?: (key: string) => void;
  /**
   * 该属性需要继承 Popover 组件
   */
  as?: React.ElementType; // 新增 as 属性
}

export interface DropdownMenuItemProps {
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void | Promise<void>;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  label?: React.ReactNode;
  title?: string;
}

const DropdownMenuItem = forwardRef<HTMLButtonElement, DropdownMenuItemProps>(
  ({ onClick, disabled, icon, label, className, title }, ref) => {
    const [loading, setLoading] = useState(false);

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (!onClick) {
          return;
        }

        setLoading(true);

        const result = onClick(e);

        // 根据 onClick 是否为 promise 是否开启loading
        if (result instanceof Promise) {
          result.finally(() => {
            setLoading(false);
          });
          return;
        }

        setLoading(false);
      },
      [onClick]
    );

    return (
      <button
        ref={ref}
        title={title}
        onClick={onClick ? handleClick : undefined}
        disabled={disabled || loading}
        className={clsx(
          className ||
            "p-1.5 w-full transition-colors duration-200 flex items-center",
          disabled || loading
            ? "text-gray-400 cursor-not-allowed bg-gray-100"
            : "text-gray-700 hover:bg-gray-200"
        )}
      >
        {loading ? <FiLoader className="mr-2 animate-spin" /> : icon} {label}
      </button>
    );
  }
);

function DropdownMenu({
  trigger,
  items,
  onChange,
  as: Component = Popover,
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);

  const content = (
    <div className="py-2 bg-white">
      {items.map((item) => (
        <DropdownMenuItem {...item} key={item.key} />
      ))}
    </div>
  );
  // className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-blue-100 hover:text-blue-900"

  return (
    <Component
      content={content}
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      placement="bottomLeft"
      arrow={false}
      noPadding
    >
      {trigger}
    </Component>
  );
}

DropdownMenuItem.displayName = "DropdownMenuItem";

DropdownMenu.Item = DropdownMenuItem;

export default DropdownMenu;
