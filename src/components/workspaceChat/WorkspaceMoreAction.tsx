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
import { useLocales } from "@/container/LocalesPovider";
import { log } from "@/utils/log";

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
      className={`p-1.5 w-full transition-colors duration-200 flex items-center justify-start ${
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
  const { t } = useLocales<"/creator">();
  const handlePublish = useCallback(async () => {
    const previewResult = await controller.publish(state);
    if (previewResult.url) {
      const fullUrl = `${window.location.origin}${previewResult.url}`;
      message.success(
        <span>
          {t["workspace.tip.publish.preview"]}
          <a
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 underline"
          >
            {t["workspace.actions.openPreview"]}
          </a>
        </span>
      );
    } else {
      message.error(t["workspace.tip.publish.error"]);
    }
  }, [controller, state, t]);

  return (
    <LoadingButton onClick={handlePublish} icon={<FiUpload className="mr-2" />}>
      {t["workspace.actions.publish"]}
    </LoadingButton>
  );
};

const ExportMenuItem = () => {
  const { state, controller } = useContext(WorkspaceContext)!;
  const { t } = useLocales<"/creator">();
  const handleExport = useCallback(async () => {
    try {
      await controller.exportProject(state.code);
      message.success(t["workspace.tip.export.success"]);
    } catch (error) {
      log.error("导出错误:", error);
      message.error(t["workspace.tip.export.error"]);
    }
  }, [controller, state, t]);

  return (
    <LoadingButton
      onClick={handleExport}
      icon={<FiDownload className="mr-2" />}
    >
      {t["workspace.actions.export"]}
    </LoadingButton>
  );
};

const SaveMenuItem = () => {
  const { controller } = useContext(WorkspaceContext)!;
  const { t } = useLocales<"/creator">();

  const handleSave = useCallback(async () => {
    try {
      await controller.save();
      message.success(t["workspace.tip.save.success"]);
    } catch (error) {
      message.error(t["workspace.tip.save.error"]);
    }
  }, [controller, t]);

  return (
    <LoadingButton onClick={handleSave} icon={<FiSave className="mr-2" />}>
      {t["workspace.actions.save"]}
    </LoadingButton>
  );
};

export function WorkspaceMoreAction({
  iconSize,
}: {
  iconSize?: IconButtonProps["size"];
}) {
  const { t } = useLocales<"/creator">();
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
        <IconButton
          size={iconSize}
          active={isActive}
          title={t["workspace.actions.more"]}
        >
          <FiMoreVertical />
        </IconButton>
      </span>
    </WorkspacePopover>
  );
}
