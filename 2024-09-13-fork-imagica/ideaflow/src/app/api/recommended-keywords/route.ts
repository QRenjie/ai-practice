import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { lastMessage } = await req.json();

  try {
    // 这里应该调用 AI 服务来获取推荐关键词
    // 现在我们只是模拟一些关键词
    const keywords = generateMockKeywords(lastMessage);

    return NextResponse.json({ keywords });
  } catch (error) {
    console.error('生成推荐关键词时发生错误:', error);
    return NextResponse.json({ error: '处理请求时发生错误' }, { status: 500 });
  }
}

function generateMockKeywords(lastMessage: string): string[] {
  // 这里应该实现实际的 AI 逻辑来生成关键词
  // 现在我们只是返回一些基于最后消息的模拟关键词
  const baseKeywords = ["继续", "解释", "示例", "优化", "替代方案"];
  const messageWords = lastMessage.split(' ').filter(word => word.length > 3);
  const combinedKeywords = [...baseKeywords, ...messageWords];
  return combinedKeywords.slice(0, 5); // 返回最多5个关键词
}