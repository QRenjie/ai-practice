import React, { useContext, useState } from 'react';
import WorkspaceContext from '../context/WorkspaceContext';

const languageOptions = [
  { value: "javascript", disabled: true, label: "JavaScript" },
  { value: "python", disabled: false, label: "Python" },
  { value: "nodejs", disabled: true, label: "Node.js" },
] as const;

type Language = typeof languageOptions[number]['value'];

const WorkspaceCodeExecutor: React.FC = () => {
  const { state, updatePythonCode, updateCodeOutput } = useContext(WorkspaceContext)!;
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<Language>('python');

  const executeCode = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: state.pythonCode, language: 'python' }),
      });
      const data = await response.json();
      updateCodeOutput(data.result);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      updateCodeOutput('执行出错：' + (error as Error).message);
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
          value={state.pythonCode}
          onChange={(e) => updatePythonCode(e.target.value)}
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
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">执行结果：</h3>
        <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-x-auto">{state.codeOutput}</pre>
      </div>
    </div>
  );
};

export default WorkspaceCodeExecutor;
