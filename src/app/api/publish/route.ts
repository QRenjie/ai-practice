import { NextRequest, NextResponse } from "next/server";
import { WorkspaceState } from "@/types/workspace";
import { WorkspaceEncrypt } from "@/utils/WorkspaceEncrypt";
import { RoutePublish } from "@/types/routeApi";

export async function POST(req: NextRequest) {
  const WorkspaceState = (await req.json()) as WorkspaceState;

  try {
    if (!WorkspaceState) {
      return NextResponse.json(
        { message: "WorkspaceState 不能为空" },
        { status: 400 }
      );
    }
    const previewId = WorkspaceEncrypt.encrypt(WorkspaceState);
    return NextResponse.json({ previewId } as RoutePublish["response"]);
  } catch (error) {
    console.error("构建过程中出错:", error);
    return NextResponse.json({ message: "构建过程中出错" }, { status: 500 });
  }
}
