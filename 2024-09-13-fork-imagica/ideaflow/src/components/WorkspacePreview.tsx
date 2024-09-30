import React from "react";
import { SandpackPreview } from "@codesandbox/sandpack-react";

const WorkspacePreview: React.FC = () => {
  const renderContent = () => {
    return (
      <SandpackPreview
        className="h-full w-full"
        showRefreshButton={true}
        showOpenInCodeSandbox={false}
      />
    );
  };

  return (
    <div className="w-full h-full overflow-auto bg-white shadow-md flex items-center justify-center">
      {renderContent()}
    </div>
  );
};

export default WorkspacePreview;
