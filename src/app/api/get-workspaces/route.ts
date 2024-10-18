import { NextRequest, NextResponse } from "next/server";
import { WorkspaceSaveManager } from "@/utils/server/WorkspaceDataManager";
import { log } from "@/utils/log";

const workspaceSaveManager = new WorkspaceSaveManager();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type");

  if (type !== "public" && type !== "my") {
    return NextResponse.json({ error: "无效的工作区类型" }, { status: 400 });
  }

  try {
    const workspaces = await workspaceSaveManager.getWorkspaces(type);
    log.log("workspaces", workspaces);
    return NextResponse.json(workspaces);
  } catch (error) {
    log.error("获取工作区时出错:", error);
    return NextResponse.json({ error: "获取工作区失败" }, { status: 500 });
  }
}
