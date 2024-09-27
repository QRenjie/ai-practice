import { NextRequest, NextResponse } from "next/server";
import { AIResponse } from "@/types/apiTypes";
import { openAIClient } from "@/utils/ServerClient";

export async function POST(req: NextRequest) {
  const { model, message, history } = await req.json();

  try {
    const response = await openAIClient.chat({
      model,
      message,
      history,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("OpenAI API错误:", error);
    const errorResponse: AIResponse = { error: "处理请求时发生错误" };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
