import { openAIClient } from "@/base/api/OpenAIClient";
import ApiCommonParams from "@/utils/ApiCommonParams";
import { log } from "@/utils/log";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const aiApiParams = (await req.json()) as ApiCommonParams;

  try {
    if (Array.isArray(aiApiParams.messages) && aiApiParams.messages.length) {
      const result = await openAIClient.generateKeywords(aiApiParams);
      return NextResponse.json(result);
    }
    return NextResponse.json({ keywords: [] });
  } catch (error) {
    log.error("生成推荐关键词时发生错误:", error);
    return NextResponse.json({ error: "处理请求时发生错误" }, { status: 500 });
  }
}
