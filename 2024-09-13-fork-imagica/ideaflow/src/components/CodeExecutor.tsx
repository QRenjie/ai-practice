import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";

interface CodeExecutorProps {
  initialCode?: string;
  initialLanguage?: "javascript" | "python";
}

interface ApiErrorResponse {
  error: string;
}

const languageOptions = [
  { value: "javascript", disabled: true, label: "JavaScript" },
  { value: "python", disabled: false, label: "Python" },
  { value: "nodejs", disabled: true, label: "Node.js" },
] as const;

type Language = typeof languageOptions[number]['value'];

const CodeExecutor: React.FC<CodeExecutorProps> = ({
  initialCode = "",
  initialLanguage = "python",
}) => {
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState<Language>(initialLanguage);
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setCode(initialCode);
    setLanguage(initialLanguage);
  }, [initialCode, initialLanguage]);

  const executeCode = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post<{ result: string }>("/api/code", { code, language });
      setResult(response.data.result);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        setResult(`错误: ${axiosError.response?.data?.error || axiosError.message}`);
      } else {
        setResult(`未知错误: ${(error as Error).message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="mb-4">
        <label htmlFor="language-select" className="block text-sm font-medium text-gray-700 mb-2">
          选择语言
        </label>
        <select
          id="language-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value as Language)}
          className="w-full px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {languageOptions.map((lang) => (
            <option key={lang.value} value={lang.value} disabled={lang.disabled}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="code-input" className="block text-sm font-medium text-gray-700 mb-2">
          输入代码
        </label>
        <textarea
          id="code-input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="在此输入要执行的代码"
          className="w-full h-40 px-3 py-2 text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>
      <button
        onClick={executeCode}
        disabled={isLoading}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
      >
        {isLoading ? "执行中..." : "执行代码"}
      </button>
      {result && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">执行结果：</h3>
          <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">{result}</pre>
        </div>
      )}
    </div>
  );
};

export default CodeExecutor;
