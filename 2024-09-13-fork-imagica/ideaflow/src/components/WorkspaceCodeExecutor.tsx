import React, { useContext } from 'react';
import WorkspaceContext from '../context/WorkspaceContext';

const WorkspaceCodeExecutor: React.FC = () => {
  const { state, updatePythonCode, updateCodeOutput } = useContext(WorkspaceContext)!;

  const executeCode = async () => {
    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: state.pythonCode, language: 'python' }),
      });
      const data = await response.json();
      updateCodeOutput(data.result);
    } catch (error) {
      updateCodeOutput('执行出错：' + (error as Error).message);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 p-4">
      <textarea
        value={state.pythonCode}
        onChange={(e) => updatePythonCode(e.target.value)}
        className="flex-1 p-2 font-mono border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="输入Python代码..."
      />
      <button 
        onClick={executeCode} 
        className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-lg hover:bg-blue-600 transition-colors"
      >
        执行代码
      </button>
      <pre className="mt-4 p-4 bg-white border rounded-lg overflow-auto">{state.codeOutput}</pre>
    </div>
  );
};

export default WorkspaceCodeExecutor;
