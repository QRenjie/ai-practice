import React from "react";
import DropdownMenu from "./DropdownMenu";

export interface IconButtonProps {
  children?: React.ReactNode;
  isActive?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  title?: string;
  disabled?: boolean;
  size?: "xs" | "sm" | "md" | "lg"; // 使用 Tailwind 风格的尺寸
}
/**
 * 需要加ref防止findDOMNode警告
 */
const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { children, isActive, onClick, title, disabled = false, size = "md" },
    ref
  ) => {
    const baseButtonClass =
      "p-1.5 rounded-full transition-colors duration-200 flex items-center justify-center";
    const activeClass = "bg-blue-500 text-white hover:bg-blue-600";
    const inactiveClass = "bg-gray-200 text-gray-700 hover:bg-gray-300";

    // 根据 size 属性设置尺寸类
    const sizeClass = {
      xs: "w-5 h-5",
      sm: "w-6 h-6",
      md: "w-7 h-7",
      lg: "w-8 h-8",
    }[size];

    return (
      <DropdownMenu.Item
        ref={ref}
        className={`${baseButtonClass} ${
          isActive ? activeClass : inactiveClass
        } ${sizeClass}`}
        onClick={onClick}
        title={title}
        disabled={disabled}
        label={children}
      />
    );
  }
);

IconButton.displayName = "IconButton";

export default IconButton;
