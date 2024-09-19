import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';

const CodeExecutor: React.FC = () => {
  const [code, setCode] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const executeCode = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/execute', { code });
      setResult(JSON.stringify(response.data.result, null, 2));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setResult(`错误: ${error.response?.data?.error || error.message}`);
      } else {
        setResult(`错误: ${(error as Error).message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <textarea
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="输入要执行的代码"
        rows={10}
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
        onClick={executeCode}
        disabled={isLoading}
      >
        {isLoading ? '执行中...' : '执行'}
      </button>
      <pre className="mt-4 bg-gray-100 p-4 rounded">
        {result}
      </pre>
    </div>
  );
};

export default CodeExecutor;
