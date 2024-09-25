import React, { useContext, useEffect, useState } from "react";
import WorkspaceContext from "../context/WorkspaceContext";
import MonacoEditor from "@monaco-editor/react";

const WorkspaceCodeHistory: React.FC = () => {
  const { state, updateMergedCodeBlocks } = useContext(WorkspaceContext)!;
  const { code: { mergedCodeBlocks } } = state;
  const [currentCode, setCurrentCode] = useState<string>("");
  const [currentLanguage, setCurrentLanguage] = useState<string>("javascript");

  useEffect(() => {
    if (mergedCodeBlocks.length > 0) {
      setCurrentCode(mergedCodeBlocks[0].code); // 假设我们只编辑第一个代码块
      setCurrentLanguage(mergedCodeBlocks[0].language); // 设置当前语言
    }
  }, [mergedCodeBlocks]);

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCurrentCode(value);
      const updatedCodeContent = mergedCodeBlocks.map((block, index) => {
        if (index === 0) {
          return { ...block, code: value };
        }
        return block;
      });
      updateMergedCodeBlocks(updatedCodeContent);
    }
  };

  return (
    <div className="p-4 overflow-auto h-full bg-white rounded-lg shadow-md flex items-center justify-center">
      {mergedCodeBlocks.length > 0 ? (
        <MonacoEditor
          language={currentLanguage} // 使用当前代码块的语言
          theme="vs-dark"
          value={currentCode}
          onChange={handleCodeChange}
          options={{
            minimap: { enabled: false },
          }}
        />
      ) : (
        <div className="text-center text-gray-500">
          <h2 className="text-xl font-semibold">代码历史</h2>
          <p>没有代码历史</p>
        </div>
      )}
    </div>
  );
};

export default WorkspaceCodeHistory;
