import { openAIClient } from "@/base/api/ServerClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  try {
    if (Array.isArray(messages) && messages.length) {
      const result = await openAIClient.generateKeywords({ messages });
      return NextResponse.json(result);
    }
    return NextResponse.json({ keywords: [] });
  } catch (error) {
    console.error("生成推荐关键词时发生错误:", error);
    return NextResponse.json({ error: "处理请求时发生错误" }, { status: 500 });
  }
}
