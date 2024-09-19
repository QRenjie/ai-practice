import type { NextApiRequest, NextApiResponse } from 'next';
import { VM } from 'vm2';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { code, language } = req.body;
  
  console.log(`Received request to execute ${language} code`);
  
  try {
    let result;
    if (language === 'javascript') {
      console.log('Executing JavaScript code');
      result = await executeJavaScript(code);
    } else if (language === 'python') {
      console.log('Executing Python code');
      result = await executePython(code);
    } else {
      throw new Error('不支持的语言');
    }
    console.log('Execution successful, result:', result);
    res.json({ result });
  } catch (error) {
    console.error('Execution error:', error);
    res.status(500).json({ error: (error as Error).message });
  }
}

async function executeJavaScript(code: string): Promise<string> {
  const vm = new VM({
    timeout: 3000,
    sandbox: {
      console: {
        log: (...args: unknown[]) => {
          console.log(...args);
          return args.join(' ');
        }
      }
    }
  });

  return vm.run(code);
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