import { useCallback, useContext, useEffect } from "react";
import Popover, { PopoverProps } from "../common/Popover";
import WorkspaceContext from "@/container/WorkspaceContext";

/**
 * 该组件是一个受控组件 open 必传
 *
 * @param props
 * @returns
 */
export default function WorkspacePopover(
  props: Omit<PopoverProps, "open"> & {
    open: boolean;
  }
) {
  const { controller } = useContext(WorkspaceContext)!;

  useEffect(() => {
    controller.store.togglePreviewMask(props.open);
  }, [controller, props.open]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      // 清除preview mask
      controller.store.togglePreviewMask(open);

      // 调用onVisibleChange和onOpenChangel
      (props.onVisibleChange || props.onOpenChange)?.(open);
    },
    [props.onOpenChange, props.onVisibleChange, controller]
  );

  return <Popover {...props} onOpenChange={handleOpenChange} />;
}
