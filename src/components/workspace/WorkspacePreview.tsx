import React, { memo, useContext, useRef } from "react";
import { SandpackPreview } from "@codesandbox/sandpack-react";
import WorkspaceContext from "@/container/WorkspaceContext";
import clsx from "clsx";

const WorkspacePreview = memo(() => {
  const { localState, controller } = useContext(WorkspaceContext)!;
  const maskRef = useRef<HTMLDivElement>(null);

  const handleMaskClick = () => {
    controller.store.togglePreviewMask(false);
    maskRef.current?.classList.toggle("hidden");
  };

  return (
    <div
      data-testid="workspace-preview"
      className="w-full h-full overflow-auto bg-white shadow-md flex items-center justify-center relative"
    >
      <SandpackPreview
        className="h-full w-full"
        showRefreshButton={true}
        showRestartButton={false}
        showOpenInCodeSandbox={false}
      />
      <div
        ref={maskRef}
        onMouseDown={handleMaskClick}
        className={clsx("absolute", {
          ["inset-0"]: localState.stopPreviewMask,
        })}
      ></div>
    </div>
  );
});

WorkspacePreview.displayName = "WorkspacePreview";

export default WorkspacePreview;
