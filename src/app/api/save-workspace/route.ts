import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { MetaState, WorkspaceState } from "@/types/workspace";

export async function POST(req: NextRequest) {
  const state = await req.json();

  return handleSaveWorkspace(state as WorkspaceState);
}

async function handleSaveWorkspace(state: WorkspaceState) {
  try {
    if (!state.id) {
      throw new Error("工作区缺少 id");
    }

    const workspaceKey = state.id;

    // 更新 meta 信息
    if (!state.meta) {
      state.meta = {} as MetaState;
    }
    state.meta.updatedAt = new Date().getTime();

    // 定义保存路径
    const savePath = path.join(process.cwd(), ".data");
    const fileName = "workspaces.json";
    const filePath = path.join(savePath, fileName);

    // 确保保存目录存在
    await fs.mkdir(savePath, { recursive: true });

    // 读取现有的工作区数据（如果文件存在）
    let existingWorkspaces: Record<string, WorkspaceState> = {};
    try {
      const fileContent = await fs.readFile(filePath, "utf-8");
      existingWorkspaces = JSON.parse(fileContent);
    } catch (error) {
      // 如果文件不存在或解析失败，使用空对象
      console.log("创建新的工作区文件");
    }

    // 添加新的工作区到现有数据中
    existingWorkspaces[workspaceKey] = state;

    // 将更新后的数据写入文件
    await fs.writeFile(
      filePath,
      JSON.stringify(existingWorkspaces, null, 2),
      "utf-8"
    );

    console.log("工作区已保存到:", filePath);

    return NextResponse.json({ success: true, workspaceKey });
  } catch (error) {
    console.error("保存工作区时出错:", error);
    return NextResponse.json(
      { error: (error as Error).message || "保存工作区失败" },
      { status: 500 }
    );
  }
}

// 其他现有的处理函数...
