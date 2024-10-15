import { openAIClient } from "@/base/api/OpenAIClient";
import ApiCommonParams from "@/utils/ApiCommonParams";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const aiApiParams = (await req.json()) as ApiCommonParams;

  try {
    if (Array.isArray(aiApiParams.messages) && aiApiParams.messages.length) {
      const result = await openAIClient.generateTitles(aiApiParams);
      return NextResponse.json(result);
    }
    return NextResponse.json({ titles: [] });
  } catch (error) {
    console.error("生成推荐标题时发生错误:", error);
    return NextResponse.json({ error: "处理请求时发生错误" }, { status: 500 });
  }
}
