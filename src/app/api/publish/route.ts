import { NextRequest, NextResponse } from "next/server";
import { WorkspaceState } from "@/types/workspace";
import { RoutePublish } from "@/types/routeApi";
import { WorkspacePublishManager } from "@/utils/server/WorkspaceDataManager";
import { log } from "@/utils/log";

const workspacePublishManager = new WorkspacePublishManager();

export async function POST(req: NextRequest) {
  const workspaceState = (await req.json()) as WorkspaceState;

  try {
    if (!workspaceState) {
      return NextResponse.json(
        { message: "WorkspaceState 不能为空" },
        { status: 400 }
      );
    }

    const { workspaceToken, token } = await workspacePublishManager.set(
      workspaceState
    );

    return NextResponse.json({
      token: workspaceToken,
      publishKey: token,
    } as RoutePublish["response"]);
  } catch (error) {
    log.error("构建过程中出错:", error);
    return NextResponse.json({ message: "构建过程中出错" }, { status: 500 });
  }
}
