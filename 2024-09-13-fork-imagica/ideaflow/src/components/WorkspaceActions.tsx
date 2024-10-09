import WorkspaceContext from "@/context/WorkspaceContext";
import { exportManager } from "@/utils/ExportManager";
import { PreviewPublisher } from "@/utils/PreviewPublisher";
import { workspaceManager } from "@/utils/WorkspaceManager";
import { message } from "antd";
import { useContext } from "react";

export function WorkspaceActions() {
  const { state } = useContext(WorkspaceContext)!;
  const { isSandpackLoading } = state.config;

  const handlePublish = async () => {
    const previewUrl = await PreviewPublisher.publish(state);
    console.log("jj previewUrl", previewUrl);
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

  const handleExport = () => {
    exportManager.exportProject(state.code);
  };

  // 新增保存函数
  const handleSave = async () => {
    try {
      await workspaceManager.save(state);
      message.success("工作区保存成功");
    } catch (error) {
      message.error("保存失败，请稍后重试");
    }
  };

  return (
    <div className="flex">
      <button
        className="px-4 py-2 bg-green-500 text-white hover:bg-green-600 transition-colors duration-300"
        onClick={handlePublish}
        disabled={isSandpackLoading}
      >
        发布
      </button>
      <button
        className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-300"
        onClick={handleExport}
        disabled={isSandpackLoading}
      >
        导出
      </button>
      {/* 新增保存按钮 */}
      <button
        className="px-4 py-2 bg-purple-500 text-white hover:bg-purple-600 transition-colors duration-300"
        onClick={handleSave}
        disabled={isSandpackLoading}
      >
        保存
      </button>
    </div>
  );
}
