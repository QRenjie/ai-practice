import React from "react";

export interface IconButtonProps {
  icon: React.ReactNode;
  isActive: boolean;
  onClick: (e: React.MouseEvent) => void;
  title: string;
  disabled?: boolean;
  size?: "xs" | "sm" | "md" | "lg"; // 使用 Tailwind 风格的尺寸
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  isActive,
  onClick,
  title,
  disabled = false,
  size = "md", // 默认尺寸
}) => {
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
    <button
      className={`${baseButtonClass} ${isActive ? activeClass : inactiveClass} ${sizeClass}`}
      onClick={onClick}
      title={title}
      type="button"
      disabled={disabled}
    >
      {icon}
    </button>
  );
};

export default IconButton;