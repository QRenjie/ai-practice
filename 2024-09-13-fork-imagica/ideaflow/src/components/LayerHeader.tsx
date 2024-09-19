import React from "react";

interface LayerHeaderProps {
  onFit: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  isMinimized: boolean;
  isMaximized: boolean;
  title: string;
}

const IconButton: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="text-white hover:bg-white hover:bg-opacity-20 rounded p-1 transition-colors duration-200"
  >
    {children}
  </button>
);

const LayerHeader: React.FC<LayerHeaderProps> = ({
  onFit,
  onMinimize,
  onMaximize,
  isMinimized,
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
      className="draggable-handle cursor-move bg-black bg-opacity-30 p-2 rounded-t-lg flex justify-between items-center"
      onDoubleClick={handleDoubleClick}
    >
      <span className="text-white font-semibold">{title}</span>
      <div className="flex space-x-2">
        <IconButton onClick={onFit}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </IconButton>
        <IconButton onClick={onMinimize}>
          {isMinimized ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 7a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 6a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          )}
        </IconButton>
        <IconButton onClick={onMaximize}>
          {isMaximized ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 3a1 1 0 011-1h10a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V3zm1 0v10h10V3H5z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V3zm1 1v10h10V4H4z" clipRule="evenodd" />
            </svg>
          )}
        </IconButton>
      </div>
    </div>
  );
};

export default LayerHeader;