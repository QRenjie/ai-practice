import { Menu } from "antd";
import WorkspacePopover from "./WorkspacePopover";
import WorkspaceContext from "@/container/WorkspaceContext";
import { useCallback, useContext, useState } from "react";
import modelsJson from "../../../config/models.json";

const models = Object.entries(modelsJson).map(([, value]) => ({
  key: value,
  value: value,
  label: value,
}));

export function WorkspaceModelSelect() {
  const { state, controller } = useContext(WorkspaceContext)!;
  const [open, setOpen] = useState(false);

  const handleModelChange = useCallback(
    (value: unknown) => {
      controller.updateConfig({
        selectedModel: (value as (typeof models)[number]).key,
      });
      setOpen(false);
    },
    [controller]
  );

  return (
    <WorkspacePopover
      content={
        <Menu
          items={models}
          activeKey={state.config.selectedModel}
          onSelect={handleModelChange}
        />
      }
      open={open}
      onOpenChange={setOpen}
      noPadding
    >
      <span className="text-sm cursor-pointer hover:text-primary">
        {state.config.selectedModel}
      </span>
    </WorkspacePopover>
  );
}
