import { openAIClient } from "@/base/api/OpenAIClient";
import { RouteRecommendTitles } from "@/types/routeApi";
import ApiCommonParams from "@/utils/ApiCommonParams";
import { log } from "@/utils/log";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const aiApiParams = (await req.json()) as ApiCommonParams;

  try {
    if (Array.isArray(aiApiParams.messages) && aiApiParams.messages.length) {
      const result = await openAIClient.generateTitles(aiApiParams);
      return NextResponse.json(result);
    }
    return NextResponse.json({
      titles: [],
    } as RouteRecommendTitles["response"]);
  } catch (error) {
    log.error("生成推荐标题时发生错误:", error);
    return NextResponse.json(
      {
        titles: [],
        error: "处理请求时发生错误",
      } as RouteRecommendTitles["response"],
      { status: 500 }
    );
  }
}
