import React, { useContext, useEffect, useState } from "react";
import WorkspaceContext from "../context/WorkspaceContext";
import MonacoEditor from "@monaco-editor/react";
import {
  SandpackCodeEditor,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";

const WorkspaceCode: React.FC = () => {
  const { state } = useContext(WorkspaceContext)!;

  // useEffect(() => {
  //   if (mergedCodeBlocks.length > 0) {
  //     setCurrentCode(mergedCodeBlocks[0].content); // 假设我们只编辑第一个代码块
  //     setCurrentLanguage(mergedCodeBlocks[0].language); // 设置当前语言
  //   }
  // }, [mergedCodeBlocks]);

  // const handleCodeChange = (value: string | undefined) => {
  //   if (value !== undefined) {
  //     setCurrentCode(value);
  //     const updatedCodeContent = mergedCodeBlocks.map((block, index) => {
  //       if (index === 0) {
  //         return { ...block, content: value };
  //       }
  //       return block;
  //     });
  //     updateMergedCodeBlocks(updatedCodeContent);
  //   }
  // };

  return (
    <div className="p-4 overflow-auto h-full bg-white rounded-lg shadow-md flex items-center justify-center">
      <div className="h-full w-full flex justify-between">
        {/* <SandpackFileExplorer /> */}
        {/* 替换为 sandpack 的编辑器 */}
        <SandpackCodeEditor className="h-full" showTabs />
      </div>

      {/* {mergedCodeBlocks.length > 0 ? (
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
      )} */}
    </div>
  );
};

export default WorkspaceCode;
