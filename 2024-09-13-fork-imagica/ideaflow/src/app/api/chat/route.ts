import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { message } = await request.json();
  // 这里可以添加处理消息的逻辑，例如调用 AI 模型
  const response = `Received: ${message}`;
  return NextResponse.json({ response });
}
