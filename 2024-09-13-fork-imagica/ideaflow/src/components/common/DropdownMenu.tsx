import React, { forwardRef, useCallback, useState } from "react";
import Popover, { PopoverProps } from "./Popover";
import { FiLoader } from "react-icons/fi";
import clsx from "clsx";
import { Menu, MenuProps } from "antd";
export interface DropdownMenuProps extends PopoverProps {
  children: React.ReactNode;
  items: MenuProps["items"];
  onChange?: MenuProps["onSelect"];
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
  children?: React.ReactNode;
  title?: string;
}

export const DropdownMenuItem = forwardRef<
  HTMLButtonElement,
  DropdownMenuItemProps
>(({ onClick, disabled, icon, label, className, title, children }, ref) => {
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
      {loading ? <FiLoader className="mr-2 animate-spin" /> : icon}{" "}
      {label || children}
    </button>
  );
});

function DropdownMenu({
  children,
  items,
  onChange,
  as: Component = Popover,
  ...rest
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <Component
      content={<Menu onSelect={onChange} items={items} />}
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      placement="bottomLeft"
      arrow={false}
      noPadding
      {...rest}
    >
      {children}
    </Component>
  );
}

DropdownMenuItem.displayName = "DropdownMenuItem";

DropdownMenu.Item = DropdownMenuItem;

export default DropdownMenu;
