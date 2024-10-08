import React from "react";
import { FiMaximize2, FiMinimize2, FiX, FiMinus } from "react-icons/fi";

interface LayerHeaderProps {
  onFit: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  isMinimized: boolean;
  isMaximized: boolean;
  title: string;
}

const IconButton: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
}> = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="text-gray-700 hover:bg-gray-300 rounded p-1 transition-colors duration-200"
  >
    {children}
  </button>
);

const LayerHeader: React.FC<LayerHeaderProps> = ({
  onFit,
  onMinimize,
  onMaximize,
  onClose,
  isMaximized,
  title,
}) => {
  const handleDoubleClick = () => {
    if (isMaximized) {
      onFit();
    } else {
      onMaximize();
    }
  };

  return (
    <div
      className="draggable-handle cursor-move bg-gray-100 p-2 rounded-t-lg flex justify-between items-center"
      onDoubleClick={handleDoubleClick}
    >
      <span className="text-gray-700 font-semibold">{title}</span>
      <div className="flex space-x-2">
        {/* <IconButton onClick={onFit}>
          <FiSquare />
        </IconButton> */}
        <IconButton onClick={onMinimize}>
          <FiMinus />
        </IconButton>
        <IconButton onClick={onMaximize}>
          {isMaximized ? <FiMinimize2 /> : <FiMaximize2 />}
        </IconButton>
        <IconButton onClick={onClose}>
          <FiX />
        </IconButton>
      </div>
    </div>
  );
};

export default LayerHeader;
