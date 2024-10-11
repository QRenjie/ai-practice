import React, { useContext } from "react";
import { FiMaximize2, FiMinimize2, FiX, FiMinus } from "react-icons/fi";
import clsx from "clsx";
import { LayerContext } from "@/context/LayerContext";
import { title } from "process";

interface LayerHeaderProps {
  className?: string;
}

const IconButton: React.FC<{
  onClick?: () => void;
  children: React.ReactNode;
}> = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="text-gray-700 hover:bg-gray-300 rounded p-1 transition-colors duration-200"
  >
    {children}
  </button>
);

const LayerHeader: React.FC<LayerHeaderProps> = ({ className }) => {
  const { state, handleFit, handleMaximize, handleMinimize, onClose } =
    useContext(LayerContext)!;

  const handleDoubleClick = () => {
    if (state?.isMaximized) {
      handleFit();
    } else {
      handleMaximize();
    }
  };

  return (
    <div
      data-testid="LayerHeader"
      className={clsx(
        "draggable-handle cursor-move bg-gray-100 p-2 rounded-t-lg flex justify-between items-center",
        className
      )}
      onDoubleClick={handleDoubleClick}
    >
      <span className="text-gray-700 font-semibold">{title}</span>
      <div className="flex space-x-2">
        <IconButton onClick={handleMinimize}>
          <FiMinus />
        </IconButton>
        <IconButton onClick={handleMaximize}>
          {state?.isMaximized ? <FiMinimize2 /> : <FiMaximize2 />}
        </IconButton>
        <IconButton onClick={onClose}>
          <FiX />
        </IconButton>
      </div>
    </div>
  );
};

export default LayerHeader;
