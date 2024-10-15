import { openAIClient } from "@/base/api/OpenAIClient";
import ApiCommonParams from "@/utils/ApiCommonParams";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const aiApiParams = (await req.json()) as ApiCommonParams;

  try {
    const response = await openAIClient.generateCode(aiApiParams);

    return NextResponse.json(response);
  } catch (error) {
    console.error("OpenAI API错误:", error);
    const errorResponse = { error: "处理请求时发生错误" };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
