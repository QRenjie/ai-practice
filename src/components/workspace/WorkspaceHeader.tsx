import WorkspaceContext from "@/container/WorkspaceContext";
import { useCallback, useContext } from "react";
import { LayerHeaderActions } from "../LayerHeader";
import IconButton from "../common/IconButton";
import { FiCode, FiEye, FiLock, FiUnlock } from "react-icons/fi";
import { LayerContext } from "@/container/LayerContext";
import clsx from "clsx";
import EditableTitle from "../common/EditableTitle";

export default function WorkspaceHeader() {
  const { state, controller } = useContext(WorkspaceContext)!;
  const {
    draggableHandleClassName,
    state: layerState,
    handleFit,
    handleMaximize,
  } = useContext(LayerContext)!;

  const handleDoubleClick = useCallback(() => {
    if (layerState.isMaximized) {
      handleFit();
    } else {
      handleMaximize();
    }
  }, [layerState.isMaximized, handleFit, handleMaximize]);

  return (
    <header
      className={clsx("flex justify-between items-center p-2", {
        [draggableHandleClassName]: state.config.isWindowed,
        ["cursor-move"]: state.config.isWindowed,
      })}
      onDoubleClick={state.config.isWindowed ? handleDoubleClick : undefined}
    >
      <div className="flex items-center gap-2">
        <EditableTitle />
        <IconButton
          tooltipProps={{
            title: state.meta.public ? "公开工作区" : "私有工作区",
          }}
          onClick={() => {
            controller.updateMeta({ public: !state.meta.public });
          }}
        >
          {state.meta.public ? <FiUnlock /> : <FiLock />}
        </IconButton>
      </div>

      <div className="flex items-center gap-2">
        <IconButton
          tooltipProps={{
            title:
              state.ui.activeTab === "preview" ? "切换到编辑器" : "切换到预览",
          }}
          onClick={() => controller.store.toggleArea()}
        >
          {state.ui.activeTab === "preview" ? <FiCode /> : <FiEye />}
        </IconButton>

        {state.config.isWindowed && <LayerHeaderActions />}
      </div>
    </header>
  );
}
