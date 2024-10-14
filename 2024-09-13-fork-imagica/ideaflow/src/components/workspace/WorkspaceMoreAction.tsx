import React from "react";
import WorkspaceContext from "@/container/WorkspaceContext";
import { exportManager } from "@/utils/ExportManager";
import { PreviewPublisher } from "@/utils/PreviewPublisher";
import { workspaceManager } from "@/utils/WorkspaceManager";
import { message } from "antd";
import { useContext } from "react";
import { FiMoreVertical, FiUpload, FiDownload, FiSave } from "react-icons/fi";
import IconButton, { IconButtonProps } from "../common/IconButton";
import DropdownMenu, { DropdownMenuItem } from "../common/DropdownMenu";

const PublishMenuItem = () => {
  const { state } = useContext(WorkspaceContext)!;

  const handlePublish = async () => {
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
  };

  return (
    <DropdownMenuItem
      onClick={handlePublish}
      icon={<FiUpload className="mr-2" />}
    >
      发布
    </DropdownMenuItem>
  );
};

const ExportMenuItem = () => {
  const { state } = useContext(WorkspaceContext)!;

  const handleExport = async () => {
    await exportManager.exportProject(state.code);
  };

  return (
    <DropdownMenuItem
      onClick={handleExport}
      icon={<FiDownload className="mr-2" />}
    >
      导出
    </DropdownMenuItem>
  );
};

const SaveMenuItem = () => {
  const { state } = useContext(WorkspaceContext)!;

  const handleSave = async () => {
    try {
      await workspaceManager.save(state);
      message.success("工作区保存成功");
    } catch (error) {
      message.error("保存失败，请稍后重试。");
    }
  };

  return (
    <DropdownMenuItem onClick={handleSave} icon={<FiSave className="mr-2" />}>
      保存
    </DropdownMenuItem>
  );
};

export function WorkspaceMoreAction({
  iconSize,
}: {
  iconSize?: IconButtonProps["size"];
}) {
  const items = [
    {
      key: "publish",
      label: <PublishMenuItem />,
    },
    {
      key: "export",
      label: <ExportMenuItem />,
    },
    {
      key: "save",
      label: <SaveMenuItem />,
    },
  ];

  return (
    <DropdownMenu items={items}>
      <IconButton size={iconSize} title="更多操作">
        <FiMoreVertical />
      </IconButton>
    </DropdownMenu>
  );
}
