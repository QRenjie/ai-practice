import { NextRequest, NextResponse } from "next/server";
import { KeywordGenerator } from "@/utils/KeywordGenerator";

export async function POST(req: NextRequest) {
  const { chatHistory, language = "zh" } = await req.json();

  try {
    if (Array.isArray(chatHistory) && chatHistory.length) {
      const keywords = await KeywordGenerator.generateKeywords(chatHistory, language);
      return NextResponse.json({ keywords });
    }
    return NextResponse.json({ keywords: [] });
  } catch (error) {
    console.error("生成推荐关键词时发生错误:", error);
    return NextResponse.json({ error: "处理请求时发生错误" }, { status: 500 });
  }
}
