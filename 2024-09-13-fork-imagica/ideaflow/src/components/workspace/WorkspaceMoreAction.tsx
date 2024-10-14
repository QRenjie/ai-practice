import { useContext } from "react";
import { message } from "antd";
import React, { useCallback, useMemo } from "react";
import WorkspaceContext from "@/container/WorkspaceContext";
import { exportManager } from "@/utils/ExportManager";
import { PreviewPublisher } from "@/utils/PreviewPublisher";
import { workspaceManager } from "@/utils/WorkspaceManager";
import { FiMoreVertical, FiUpload, FiDownload, FiSave } from "react-icons/fi";
import IconButton, { IconButtonProps } from "../common/IconButton";
import DropdownMenu, { DropdownMenuProps } from "../common/DropdownMenu"; // 新增导入

export function WorkspaceMoreAction({
  iconSize,
}: {
  iconSize?: IconButtonProps["size"];
}) {
  const { state } = useContext(WorkspaceContext)!;

  const handlePublish = useCallback(async () => {
    const previewUrl = await PreviewPublisher.publish(state);
    if (previewUrl) {
      const fullUrl = `${window.location.origin}${previewUrl}`;
      message.success(
        <span>
          预览链接已生成：
          <a
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 underline"
          >
            点击查看预览
          </a>
        </span>
      );
    } else {
      message.error("发布预览失败，请稍后重试。");
    }
  }, [state]);

  const handleExport = useCallback(async () => {
    await exportManager.exportProject(state.code);
  }, [state]);

  const handleSave = useCallback(async () => {
    try {
      await workspaceManager.save(state);
      message.success("工作区保存成功");
    } catch (error) {
      message.error("保存失败，请稍后重试。");
    }
  }, [state]);

  const menuItems = useMemo(
    () =>
      [
        {
          key: "publish",
          label: "发布",
          onClick: handlePublish,
          icon: <FiUpload className="mr-2" />,
        },
        {
          key: "export",
          label: "导出",
          icon: <FiDownload className="mr-2" />,
          onClick: handleExport,
        },
        {
          key: "save",
          label: "保存",
          icon: <FiSave className="mr-2" />,
          onClick: handleSave,
        },
      ] as DropdownMenuProps["items"],
    [handleExport, handlePublish, handleSave]
  );

  return (
    <DropdownMenu
      trigger={
        <IconButton size={iconSize} title="更多操作">
          <FiMoreVertical />
        </IconButton>
      }
      items={menuItems}
      onChange={(key) => {
        // 根据需要处理选项更改
        console.log(`Selected action: ${key}`);
      }}
    />
  );
}
