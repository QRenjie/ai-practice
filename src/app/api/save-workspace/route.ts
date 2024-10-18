import { NextRequest, NextResponse } from "next/server";
import { MetaState, WorkspaceState } from "@/types/workspace";
import { RouteSaveWorkspace } from "@/types/routeApi";
import { WorkspaceSaveManager } from "@/utils/server/WorkspaceDataManager";
import { log } from "@/utils/log";

const workspaceSaveManager = new WorkspaceSaveManager();

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

    await workspaceSaveManager.set(workspaceKey, state);

    return NextResponse.json({
      success: true,
      workspaceKey,
    } as RouteSaveWorkspace["response"]);
  } catch (error) {
    log.error("保存工作区时出错:", error);
    return NextResponse.json(
      {
        localeKey: "saveWorkspaceError",
        error: (error as Error).message || "保存工作区失败",
      } as RouteSaveWorkspace["response"],
      { status: 500 }
    );
  }
}

// 其他现有的处理函数...
