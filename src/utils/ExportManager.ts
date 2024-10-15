import { WorkspaceState } from "@/types/workspace";
import { message } from "antd";
import AIApiScheduler, { aiApiScheduler } from "@/services/AIApiScheduler";

export class ExportManager {
  private aiApiScheduler: AIApiScheduler = aiApiScheduler;

  async exportProject(state: WorkspaceState["code"]) {
    try {
      const response = await this.aiApiScheduler.buildPreview(state);

      const blob = await response.blob();
      const fileName = this.aiApiScheduler.getFileNameFromResponse(response);

      this.downloadFile(blob, fileName);

      message.success("项目导出成功，请查看下载的 ZIP 文件。");
    } catch (error) {
      console.error("导出错误:", error);
      message.error("导出失败，请稍后重试。");
    }
  }

  private downloadFile(blob: Blob, fileName: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = fileName;

    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}

export const exportManager = new ExportManager();
