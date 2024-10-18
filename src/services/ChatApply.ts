import { WorkspaceController } from "@/controllers/WorkspaceController";
import { CodeBlock, Message } from "@/types/apiTypes";
import { WorkspaceState } from "@/types/workspace";
import { log } from "@/utils/log";
import { SandpackFile } from "@codesandbox/sandpack-react";
import sandpackFile from "config/sandpackFile";

export class ChatApply {
  constructor(private workspaceController: WorkspaceController) {}

  async apply(message: Message) {
    if (message.role === "user") {
      log.warn("只能重新应用ai消息");
      return;
    }

    if (Array.isArray(message.codeBlocks)) {
      const state = await this.workspaceController.store.getState();
      this.updatePreviewCodeBlocks(message.codeBlocks, state.code);
    }
  }

  updatePreviewCodeBlocks(
    codeBlocks: CodeBlock[],
    target: WorkspaceState["code"]
  ) {
    const result = target.files || {};
    codeBlocks.forEach((codeBlock) => {
      // 确保 fileName 以 "/" 开头
      const fileName = codeBlock.fileName.startsWith("/")
        ? codeBlock.fileName
        : `/${codeBlock.fileName}`;
      const target = result[fileName];
      if (target) {
        if (typeof target === "string") {
          result[fileName] = sandpackFile(codeBlock.content);
        } else {
          (result[fileName] as SandpackFile) = {
            ...target,
            code: codeBlock.content,
          };
        }
      } else {
        // 如果文件不存在，创建新文件
        result[fileName] = sandpackFile(codeBlock.content);
      }
    });

    log.debug("update new code", result);

    this.workspaceController.store.updateCodeFiles(result, codeBlocks);

    // TODO: 自动刷新preivew
  }
}
