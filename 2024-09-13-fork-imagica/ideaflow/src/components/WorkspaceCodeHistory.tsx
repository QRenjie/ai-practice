import React, { useContext, useEffect, useState } from "react";
import WorkspaceContext from "../context/WorkspaceContext";
import { CodeBlock } from "../types/apiTypes";
import MonacoEditor from "@monaco-editor/react";

const WorkspaceCodeHistory: React.FC = () => {
  const { state, updateMergedCodeBlocks } = useContext(WorkspaceContext)!;
  const [codeContent, setCodeContent] = useState<CodeBlock[]>([]);
  const [currentCode, setCurrentCode] = useState<string>("");
  const [currentLanguage, setCurrentLanguage] = useState<string>("javascript");

  useEffect(() => {
    if (state.mergedCodeBlocks.length > 0) {
      setCodeContent(state.mergedCodeBlocks);
      setCurrentCode(state.mergedCodeBlocks[0].code); // 假设我们只编辑第一个代码块
      setCurrentLanguage(state.mergedCodeBlocks[0].language); // 设置当前语言
    }
  }, [state.mergedCodeBlocks]);

  const handleCodeChange = (value: string | undefined) => {
    if (value !== undefined) {
      setCurrentCode(value);
      const updatedCodeContent = codeContent.map((block, index) => {
        if (index === 0) {
          return { ...block, code: value };
        }
        return block;
      });
      setCodeContent(updatedCodeContent);
      updateMergedCodeBlocks(updatedCodeContent);
    }
  };

  return (
    <div className="p-4 overflow-auto h-full">
      {codeContent.length > 0 ? (
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
        <p>没有代码历史</p>
      )}
    </div>
  );
};

export default WorkspaceCodeHistory;
