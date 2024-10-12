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

export const LayerHeaderActions: React.FC = () => {
  const { state, handleMaximize, handleMinimize, onClose } =
    useContext(LayerContext)!;
  return (
    <>
      <IconButton onClick={handleMinimize}>
        <FiMinus />
      </IconButton>
      <IconButton onClick={handleMaximize}>
        {state?.isMaximized ? <FiMinimize2 /> : <FiMaximize2 />}
      </IconButton>
      <IconButton onClick={onClose}>
        <FiX />
      </IconButton>
    </>
  );
};

const LayerHeader: React.FC<LayerHeaderProps> = ({ className }) => {
  const { state, disabled, handleFit, handleMaximize } =
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
        "draggable-handle bg-gray-100 p-2 rounded-t-lg flex justify-between items-center",
        {
          "cursor-move": !disabled,
        },
        className
      )}
      onDoubleClick={handleDoubleClick}
    >
      <span className="text-gray-700 font-semibold">{title}</span>
      {!disabled && (
        <div className="flex space-x-2">
          <LayerHeaderActions />
        </div>
      )}
    </div>
  );
};

export default LayerHeader;
