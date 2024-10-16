import WorkspaceContext from "@/container/WorkspaceContext";
import { useCallback, useContext } from "react";
import { LayerHeaderActions } from "../LayerHeader";
import IconButton from "../common/IconButton";
import { FiCode, FiEye, FiLock, FiUnlock } from "react-icons/fi";
import { LayerContext } from "@/container/LayerContext";
import clsx from "clsx";
import EditableTitle from "../common/EditableTitle";
import { useLocales } from "@/container/LocalesPovider";
import LanguageSwitcher from "../LanguageSwitcher";

export default function WorkspaceHeader() {
  const { state, controller } = useContext(WorkspaceContext)!;
  const {
    draggableHandleClassName,
    state: layerState,
    handleFit,
    handleMaximize,
  } = useContext(LayerContext)!;

  const { t } = useLocales<"/creator">();

  const handleDoubleClick = useCallback(() => {
    if (layerState.isMaximized) {
      handleFit();
    } else {
      handleMaximize();
    }
  }, [layerState.isMaximized, handleFit, handleMaximize]);

  return (
    <header
      data-testid="workspace-header"
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
            title: state.meta.public
              ? t["workspace.public"]
              : t["workspace.private"],
          }}
          onClick={() => {
            controller.updateMeta({ public: !state.meta.public });
          }}
        >
          {state.meta.public ? <FiUnlock /> : <FiLock />}
        </IconButton>

        <LanguageSwitcher />
      </div>

      <div className="flex items-center gap-2">
        <IconButton
          tooltipProps={{
            title:
              state.ui.activeTab === "preview"
                ? t["workspace.editor"]
                : t["workspace.preview"],
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
