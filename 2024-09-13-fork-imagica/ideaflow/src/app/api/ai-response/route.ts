import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { AIResponse, AIResponseData } from '@/types/apiTypes';
import { CodeExtractor } from '@/utils/CodeExtractor';

export async function POST(req: NextRequest) {
  const { message, history } = await req.json();
  const messageId = uuidv4(); // 生成消息ID

  try {
    const airesponse = await fetch(
      "http://openai-proxy.brain.loocaa.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer DlJYSkMVj1x4zoe8jZnjvxfHG6z5yGxK",
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [...history, { role: "user", content: message }],
          stream: true,
        }),
      }
    );

    if (!airesponse.ok) {
      throw new Error(`HTTP错误！状态：${airesponse.status}`);
    }

    const reader = airesponse.body?.getReader();
    const decoder = new TextDecoder("utf-8");
    let fullContent = "";

    while (true) {
      const { done, value } = await reader?.read() || { done: true, value: undefined };
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(line => line.trim() !== '');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            const codeBlocks = CodeExtractor.extract(fullContent);
            const response: AIResponseData = {
              id: messageId,
              content: fullContent,
              codeBlocks: codeBlocks
            };
            return NextResponse.json(response);
          }
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content || '';
            fullContent += content;
          } catch (error) {
            console.error('解析错误:', error);
          }
        }
      }
    }

    const codeBlocks = CodeExtractor.extract(fullContent);
    return NextResponse.json({
      id: messageId,
      content: fullContent,
      codeBlocks: codeBlocks
    });
  } catch (error) {
    console.error('流处理错误:', error);
    const errorResponse: AIResponse = { error: '处理请求时发生错误' };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}