import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { log } from '@/utils/log';

export async function POST(req: NextRequest) {
  try {
    const { id, content } = await req.json();

    if (!id || !content) {
      return NextResponse.json({ error: '缺少必要的参数' }, { status: 400 });
    }

    // 确保预览目录存在
    const previewDir = path.join(process.cwd(), 'public', 'previews');
    await fs.mkdir(previewDir, { recursive: true });

    // 保存预览内容到文件
    const filePath = path.join(previewDir, `${id}.html`);
    await fs.writeFile(filePath, content);

    return NextResponse.json({ success: true, previewUrl: `/previews/${id}.html` });
  } catch (error) {
    log.error('保存预览时出错:', error);
    return NextResponse.json({ error: '保存预览失败' }, { status: 500 });
  }
}