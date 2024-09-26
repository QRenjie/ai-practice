import { Popover as AntdPopover, PopoverProps as AntdPopoverProps } from "antd";
import React from "react";
import styles from "./Popover.module.css";
import { identity } from "lodash-es";
import clsx from "clsx";

interface PopoverProps extends AntdPopoverProps {
  children: React.ReactNode;
  content?: React.ReactNode;
  relative?: boolean;
}

function Popover({
  children,
  arrow = false,
  content,
  relative,
  ...rest
}: PopoverProps) {
  return (
    <AntdPopover
      {...rest}
      overlayClassName={clsx(styles.customPopover, rest.overlayClassName)}
      arrow={arrow}
      getPopupContainer={relative ? identity : rest.getPopupContainer}
      content={content}
    >
      {children}
    </AntdPopover>
  );
}

export default Popover;
