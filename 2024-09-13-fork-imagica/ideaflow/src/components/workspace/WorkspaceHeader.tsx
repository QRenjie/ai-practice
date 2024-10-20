import WorkspaceContext from "@/container/WorkspaceContext";
import { useCallback, useContext } from "react";
import { LayerHeaderActions } from "../LayerHeader";
import IconButton from "../common/IconButton";
import { FiCode, FiEye } from "react-icons/fi";
import { LayerContext } from "@/container/LayerContext";
import clsx from "clsx";
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
      onDoubleClick={handleDoubleClick}
    >
      <span className="text-gray-700 font-semibold">{state.ui.title}</span>

      <div className="flex items-center gap-2">
        <IconButton
          tooltipProps={{
            title:
              state.ui.activeTab === "preview" ? "切换到编辑器" : "切换到预览",
          }}
          onClick={() => controller.toggleArea()}
        >
          {state.ui.activeTab === "preview" ? <FiCode /> : <FiEye />}
        </IconButton>

        {state.config.isWindowed && <LayerHeaderActions />}
      </div>
    </header>
  );
}
