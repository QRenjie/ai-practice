import React, { useState } from 'react';
import axios from 'axios';

const CodeExecutor: React.FC = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const executeCode = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/code', { code, language });
      setResult(response.data.result);
    } catch (error) {
      // eslint-disable-next-line
      // @ts-ignore
      setResult(`错误: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="mb-2 p-2 border rounded"
      >
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
      </select>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="输入要执行的代码"
        className="w-full h-40 p-2 border rounded mb-2"
      />
      <button
        onClick={executeCode}
        disabled={isLoading}
        className="bg-blue-500 text-white p-2 rounded"
      >
        {isLoading ? '执行中...' : '执行'}
      </button>
      <pre className="mt-4 p-2 bg-gray-100 rounded">{result}</pre>
    </div>
  );
};

export default CodeExecutor;
