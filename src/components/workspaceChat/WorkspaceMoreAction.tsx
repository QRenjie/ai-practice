import React, { useCallback, useState } from "react";
import WorkspaceContext from "@/container/WorkspaceContext";
import { message } from "antd";
import { useContext } from "react";
import IconButton, { IconButtonProps } from "@/components/common/IconButton";
import WorkspacePopover from "../workspace/WorkspacePopover";
import useButtonLoading from "@/hooks/useButtonLoading";
import {
  FiMoreVertical,
  FiUpload,
  FiDownload,
  FiSave,
  FiLoader,
} from "react-icons/fi";

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
  const { loading, onClick: handleClick } = useButtonLoading(onClick);

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
  const { state, controller } = useContext(WorkspaceContext)!;

  const handlePublish = useCallback(async () => {
    const previewUrl = await controller.publish(state);
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
  }, [controller, state]);

  return (
    <LoadingButton onClick={handlePublish} icon={<FiUpload className="mr-2" />}>
      发布
    </LoadingButton>
  );
};

const ExportMenuItem = () => {
  const { state, controller } = useContext(WorkspaceContext)!;

  const handleExport = useCallback(async () => {
    try {
      await controller.exportProject(state.code);
      message.success("项目导出成功，请查看下载的 ZIP 文件。");
    } catch (error) {
      console.error("导出错误:", error);
      message.error("导出失败，请稍后重试。");
    }
  }, [controller, state]);

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
  const { controller } = useContext(WorkspaceContext)!;

  const handleSave = useCallback(async () => {
    try {
      await controller.save();
      message.success("工作区保存成功");
    } catch (error) {
      message.error("保存失败，请稍后重试。");
    }
  }, [controller]);

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
    <WorkspacePopover
      content={menu}
      open={isActive}
      onOpenChange={handlePopoverVisibleChange}
      noPadding
      forceRender
    >
      <span data-testid="workspace-more-action">
        <IconButton size={iconSize} active={isActive} title="更多操作">
          <FiMoreVertical />
        </IconButton>
      </span>
    </WorkspacePopover>
  );
}
