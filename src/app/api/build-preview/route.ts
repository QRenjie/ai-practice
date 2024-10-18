import { NextRequest, NextResponse } from "next/server";
import { isPlainObject, isString } from "lodash-es";
import { SandpackFile } from "@codesandbox/sandpack-react";
import archiver from "archiver";
import workspaceConfig from "config/workspace.json";
import { WorkspaceState } from "@/types/workspace";
import { log } from "@/utils/log";

// 添加模板名称到目录的映射
const templateToDirectoryMap: Record<string, string> = {
  react: "react-base",
  static: "static-html",
  "vite-react": "vite-react"
};

export async function POST(req: NextRequest) {
  const workspaceCode = (await req.json()) as WorkspaceState["code"];

  if (!workspaceCode || !workspaceCode.files || !workspaceCode.template) {
    return NextResponse.json(
      { message: "缺少必要的工作区代码信息" },
      { status: 400 }
    );
  }

  // 使用映射获取目标目录名
  const targetDirectory = templateToDirectoryMap[workspaceCode.template] || workspaceCode.template;

  // 获取目标模板
  const targetTemplate =
    workspaceConfig[targetDirectory as keyof typeof workspaceConfig];

  // 检查模板是否有效
  if (!targetTemplate) {
    return NextResponse.json({ message: "无效的模板" }, { status: 400 });
  }

  try {
    // 获取 workspace 中的基础文件
    const baseFiles = targetTemplate.code.files;

    // 合并文件，API 传来的文件覆盖或增加到基础文件中
    const mergedFiles = { ...baseFiles, ...workspaceCode.files };
    log.log("mergedFiles", mergedFiles);

    // 创建一个内存中的 ZIP 文件
    const archive = archiver("zip", { zlib: { level: 9 } });
    const chunks: Uint8Array[] = [];

    archive.on("data", (chunk) => chunks.push(chunk));

    // 添加文件到 ZIP
    for (const [filePath, fileContent] of Object.entries(mergedFiles)) {
      const code = isPlainObject(fileContent)
        ? (fileContent as SandpackFile).code
        : fileContent;

      if (isString(code)) {
        archive.append(code, { name: filePath });
      }
    }

    await archive.finalize();

    // 将所有 chunks 合并成一个 Uint8Array
    const zipBuffer = new Uint8Array(
      chunks.reduce((acc, val) => acc + val.length, 0)
    );
    let offset = 0;
    for (const chunk of chunks) {
      zipBuffer.set(chunk, offset);
      offset += chunk.length;
    }

    // 生成文件名：时间戳_模板名.zip
    const timestamp = new Date().getTime();
    const fileName = `${timestamp}_${workspaceCode.template}.zip`;

    // 返回 ZIP 文件
    return new NextResponse(zipBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename=${fileName}`,
      },
    });
  } catch (error) {
    log.error("构建过程中出错:", error);
    return NextResponse.json({ message: "构建过程中出错" }, { status: 500 });
  }
}
