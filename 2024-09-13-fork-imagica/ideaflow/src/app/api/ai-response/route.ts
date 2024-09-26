import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { AIResponse, AiChatResponse } from "@/types/apiTypes";
import { streamProcessor } from "@/utils/StreamProcessor";
import { CodeExtractor } from "@/utils/CodeExtractor";
import { openAIClient } from "@/utils/ServerClient";

export async function POST(req: NextRequest) {
  const { message, history } = await req.json();
  const messageId = uuidv4();

  try {
    const response = await openAIClient.chat({
      model: "gpt-3.5-turbo",
      message,
      history,
    });

    const result = await streamProcessor.processStream(
      response,
      messageId,
      (chunk) => {
        // 这里可以实现实时发送部分响应到客户端
        // 例如，使用 Server-Sent Events 或 WebSocket
        console.log("Received chunk:", chunk);
      }
    );

    return NextResponse.json({
      ...result,
      codeBlocks: CodeExtractor.extract(result.content),
    } as AiChatResponse);
  } catch (error) {
    console.error("OpenAI API错误:", error);
    const errorResponse: AIResponse = { error: "处理请求时发生错误" };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
