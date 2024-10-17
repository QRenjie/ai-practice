import { NextRequest, NextResponse } from "next/server";
import { WorkspacePublishManager } from "@/utils/server/WorkspaceDataManager";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get("id");

  return NextResponse.json(await new WorkspacePublishManager().get(id!));
}
