import React from "react";
import { WorkspaceState } from "@/types/workspace";
import WorkspacePovider from "../container/WorkspacePovider";
import WorkspacePanel from "./WorkspacePanel";
import WorkspaceSelector from "./WorkspaceSelector"; // 新增导入
import dynamic from "next/dynamic";
import WorkspaceContext from "@/context/WorkspaceContext";
import { useSliceStore } from "@qlover/slice-store-react";

const Layer = dynamic(() => import("./Layer"), {
  ssr: false,
});

const WorkspaceInner: React.FC<{
  onClose?: () => void;
  id: string;
}> = ({ onClose, id }) => {
  const { controller } = React.useContext(WorkspaceContext)!;

  const template = useSliceStore(
    controller.store,
    (state) => state.code.template
  );
  const ui = useSliceStore(controller.store, (state) => state.ui);
  const isWindowed = useSliceStore(
    controller.store,
    (state) => state.config.isWindowed
  );

  console.log("jj state workspace template", template, ui, id);

  const renderContent = () => {
    // 当template为空时，表示当前工作区为自定义工作区，需要展示工作区选择器
    if (!template) {
      return <WorkspaceSelector />;
    }
    return <WorkspacePanel />;
  };

  return (
    <Layer
      id={id}
      initialState={ui}
      onClose={onClose}
      title={ui.title}
      disabled={!isWindowed}
    >
      {renderContent()}
    </Layer>
  );
};

const Workspace: React.FC<{
  index: number;
  state: WorkspaceState;
  onClose?: (id: string) => void;
}> = ({ state, onClose }) => {
  return (
    <WorkspacePovider key={state.id} initialState={state}>
      <WorkspaceInner id={state.id} onClose={() => onClose?.(state.id)} />
    </WorkspacePovider>
  );
};

export default Workspace;
