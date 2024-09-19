import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  const { code, language } = await req.json();

  if (!code || !language) {
    return NextResponse.json({ error: '缺少代码或语言参数' }, { status: 400 });
  }

  try {
    let result;
    if (language === 'javascript') {
      const { VM } = await import('vm2');
      result = await executeJavaScript(code, VM);
    } else if (language === 'python') {
      result = await executePython(code);
    } else {
      return NextResponse.json({ error: '不支持的语言' }, { status: 400 });
    }
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    console.error('Execution error:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

async function executeJavaScript(code: string, VM: typeof import('vm2').VM): Promise<string> {
  return new Promise((resolve, reject) => {
    const vm = new VM({
      timeout: 5000,
      sandbox: {}
    });

    try {
      const result = vm.run(code);
      resolve(String(result));
    } catch (error) {
      reject(error);
    }
  });
}

async function executePython(code: string): Promise<string> {
  try {
    const { stdout, stderr } = await execAsync(`py -c "${code.replace(/"/g, '\\"')}"`);
    if (stderr) {
      throw new Error(stderr);
    }
    return stdout.trim();
  } catch (error) {
    throw new Error(`Python执行错误: ${(error as Error).message}`);
  }
}