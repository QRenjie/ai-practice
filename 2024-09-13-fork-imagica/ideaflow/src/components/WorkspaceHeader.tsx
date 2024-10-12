import WorkspaceContext from "@/context/WorkspaceContext";
import { useContext } from "react";
import { LayerHeaderActions } from "./LayerHeader";
import IconButton from "./common/IconButton";
import { FiCode, FiEye } from "react-icons/fi";

export default function WorkspaceHeader() {
  const { state,controller } = useContext(WorkspaceContext)!;

  return (
    <header className="flex justify-between items-center p-2">
      <span className="text-gray-700 font-semibold">{state.ui.title}</span>

      <div className="flex items-center gap-2">
        <IconButton onClick={() => controller.toggleArea()}>
          {state.ui.activeTab === "preview" ? <FiCode /> : <FiEye />}
        </IconButton>

        {state.config.isWindowed && <LayerHeaderActions />}
      </div>
    </header>
  );
}
