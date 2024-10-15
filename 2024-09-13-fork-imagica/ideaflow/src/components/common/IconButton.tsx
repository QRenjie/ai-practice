import React from "react";
import { FiLoader } from "react-icons/fi";
import clsx from "clsx";
import { Tooltip, TooltipProps } from "antd";
export interface IconButtonProps {
  children?: React.ReactNode;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  title?: string;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  size?: "xs" | "sm" | "md" | "lg"; // 使用 Tailwind 风格的尺寸
  tooltipProps?: TooltipProps;
}
/**
 * 需要加ref防止findDOMNode警告
 */
const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (props, ref) => {
    const {
      children,
      active,
      onClick,
      title,
      disabled = false,
      loading = false,
      size = "md",
      icon,
      className,
      tooltipProps,
    } = props;

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

    const Button = (
      <button
        ref={ref}
        className={clsx(
          className || baseButtonClass,
          active ? activeClass : inactiveClass,
          sizeClass
        )}
        onClick={onClick}
        title={title}
        disabled={disabled}
      >
        {loading ? <FiLoader className="mr-2 animate-spin" /> : icon}
        {children}
      </button>
    );

    if (tooltipProps) {
      return <Tooltip {...tooltipProps}>{Button}</Tooltip>;
    }

    return Button;
  }
);

IconButton.displayName = "IconButton";

export default IconButton;
