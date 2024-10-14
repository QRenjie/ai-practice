import { Menu } from "antd";
import WorkspacePopover from "./WorkspacePopover";
import WorkspaceContext from "@/container/WorkspaceContext";
import { useContext, useState } from "react";
import modelsJson from "../../../config/models.json";

const models = Object.entries(modelsJson).map(([, value]) => ({
  key: value,
  value: value,
  label: value,
}));

export function WorkspaceModelSelect() {
  const { state, controller } = useContext(WorkspaceContext)!;
  const [open, setOpen] = useState(false);

  return (
    <WorkspacePopover
      content={
        <Menu
          items={models}
          activeKey={state.config.selectedModel}
          onSelect={(value) =>
            controller.updateConfig({ selectedModel: value.key })
          }
        />
      }
      open={open}
      onOpenChange={setOpen}
      noPadding
    >
      {state.config.selectedModel}
    </WorkspacePopover>
  );
}
