import React, { memo } from "react";
import { SandpackPreview } from "@codesandbox/sandpack-react";

const WorkspacePreview = memo(() => {
  return (
    <div className="w-full h-full overflow-auto bg-white shadow-md flex items-center justify-center relative">
      <SandpackPreview
        className="h-full w-full"
        showRefreshButton={false}
        showRestartButton={true}
        showOpenInCodeSandbox={false}
      />
    </div>
  );
});

WorkspacePreview.displayName = "WorkspacePreview";

export default WorkspacePreview;
