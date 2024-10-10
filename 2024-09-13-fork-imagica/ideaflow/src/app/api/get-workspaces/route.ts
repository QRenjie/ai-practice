import { NextRequest, NextResponse } from 'next/server';
import { WorkspaceState } from "@/types/workspace";
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type');

  if (type !== 'public' && type !== 'my') {
    return NextResponse.json({ error: '无效的工作区类型' }, { status: 400 });
  }

  try {
    const workspaces = await getWorkspaces(type);
    return NextResponse.json(workspaces);
  } catch (error) {
    console.error('获取工作区时出错:', error);
    return NextResponse.json({ error: '获取工作区失败' }, { status: 500 });
  }
}

async function getWorkspaces(type: 'public' | 'my'): Promise<WorkspaceState[]> {
  const dataPath = path.join(process.cwd(), '.data');
  const fileName = type === 'public' ? 'workspace.public.json' : 'workspace.personal.json';
  const filePath = path.join(dataPath, fileName);

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const workspaces = JSON.parse(fileContent);
    return Object.values(workspaces);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}