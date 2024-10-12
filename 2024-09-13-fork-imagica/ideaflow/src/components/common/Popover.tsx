import { Popover as AntdPopover, PopoverProps as AntdPopoverProps } from "antd";
import React, { useEffect } from "react";
import styles from "./Popover.module.css";
import { identity } from "lodash-es";
import clsx from "clsx";

interface PopoverProps extends AntdPopoverProps {
  children: React.ReactNode;
  content?: React.ReactNode;
  relative?: boolean;
  noPadding?: boolean;
}

function Popover({
  children,
  arrow = false,
  content,
  relative,
  noPadding,
  ...rest
}: PopoverProps) {
  // 监听 esc
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        (rest.onVisibleChange || rest.onOpenChange)?.(false);
      }
    };

    if (rest.open) {
      document.addEventListener("keydown", handleEsc);
    } else {
      document.removeEventListener("keydown", handleEsc);
    }

    return () => document.removeEventListener("keydown", handleEsc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rest.open]);

  return (
    <AntdPopover
      {...rest}
      overlayClassName={clsx(
        styles.customPopover,
        rest.overlayClassName,
        noPadding && styles.noPadding
      )}
      arrow={arrow}
      getPopupContainer={relative ? identity : rest.getPopupContainer}
      content={content}
    >
      {children}
    </AntdPopover>
  );
}

export default Popover;
