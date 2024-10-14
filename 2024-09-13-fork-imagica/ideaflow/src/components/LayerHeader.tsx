import React, { useContext } from "react";
import { FiMaximize2, FiMinimize2, FiX, FiMinus, FiArrowUpRight, FiLayers, FiSquare } from "react-icons/fi";
import clsx from "clsx";
import { LayerContext } from "@/container/LayerContext";
import { title } from "process";
import { MdFilterNone } from "react-icons/md";

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
  const { state, handleFit, handleMinimize, onClose } =
    useContext(LayerContext)!;
  return (
    <>
      <IconButton onClick={handleMinimize}>
        {state.isMinimized ? <FiMaximize2 /> : <FiMinus />}
      </IconButton>
      <IconButton onClick={handleFit}>
        {state.isMaximized ? <MdFilterNone /> : <FiSquare />}
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
