import React, { useState } from "react";
import WorkspaceContext from "@/container/WorkspaceContext";
import { exportManager } from "@/utils/ExportManager";
import { PreviewPublisher } from "@/utils/PreviewPublisher";
import { workspaceManager } from "@/utils/WorkspaceManager";
import { message } from "antd";
import { useContext } from "react";
import {
  FiMoreVertical,
  FiUpload,
  FiDownload,
  FiSave,
  FiLoader,
} from "react-icons/fi";
import IconButton, { IconButtonProps } from "../common/IconButton";
import Popover from "../common/Popover";

// 封装一个加载按钮组件
const LoadingButton = ({
  onClick,
  disabled,
  icon,
  children,
}: {
  onClick: () => Promise<void>;
  disabled?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await onClick();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`p-1.5 transition-colors duration-200 flex items-center justify-center ${
        disabled || loading
          ? "text-gray-400 cursor-not-allowed bg-gray-100"
          : "text-gray-700 hover:bg-gray-200"
      }`}
    >
      {loading ? <FiLoader className="mr-2 animate-spin" /> : icon} {children}
    </button>
  );
};

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
    <LoadingButton onClick={handlePublish} icon={<FiUpload className="mr-2" />}>
      发布
    </LoadingButton>
  );
};

const ExportMenuItem = () => {
  const { state } = useContext(WorkspaceContext)!;

  const handleExport = async () => {
    await exportManager.exportProject(state.code);
  };

  return (
    <LoadingButton
      onClick={handleExport}
      icon={<FiDownload className="mr-2" />}
    >
      导出
    </LoadingButton>
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
    <LoadingButton onClick={handleSave} icon={<FiSave className="mr-2" />}>
      保存
    </LoadingButton>
  );
};

export function WorkspaceMoreAction({
  iconSize,
}: {
  iconSize?: IconButtonProps["size"];
}) {
  const [isActive, setIsActive] = useState(false);

  const handlePopoverVisibleChange = (visible: boolean) => {
    setIsActive(visible);
  };

  const menu = (
    <div className="flex flex-col">
      <PublishMenuItem />
      <ExportMenuItem />
      <SaveMenuItem />
    </div>
  );

  return (
    <Popover
      content={menu}
      trigger={["click"]}
      onOpenChange={handlePopoverVisibleChange}
      forceRender
    >
      <IconButton
        size={iconSize}
        isActive={isActive}
        onClick={(e) => e.preventDefault()}
        title="更多操作"
      >
        <FiMoreVertical />
      </IconButton>
    </Popover>
  );
}
