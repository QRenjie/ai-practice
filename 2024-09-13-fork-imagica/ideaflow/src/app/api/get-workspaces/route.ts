import { NextRequest, NextResponse } from "next/server";
import DataGetter from "@/utils/DataGetter";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type");

  if (type !== "public" && type !== "my") {
    return NextResponse.json({ error: "无效的工作区类型" }, { status: 400 });
  }

  try {
    const workspaces = DataGetter.getWorkspaces(type);
    return NextResponse.json(workspaces);
  } catch (error) {
    console.error("获取工作区时出错:", error);
    return NextResponse.json({ error: "获取工作区失败" }, { status: 500 });
  }
}
