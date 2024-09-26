import { NextRequest, NextResponse } from "next/server";
import { KeywordGenerator } from "@/utils/KeywordGenerator";

export async function POST(req: NextRequest) {
  const { lastMessage } = await req.json();

  try {
    const keywords = await KeywordGenerator.generateKeywords(lastMessage);
    return NextResponse.json({ keywords });
  } catch (error) {
    console.error("生成推荐关键词时发生错误:", error);
    return NextResponse.json({ error: "处理请求时发生错误" }, { status: 500 });
  }
}
