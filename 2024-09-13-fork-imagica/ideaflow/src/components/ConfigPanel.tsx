import React, { useContext } from "react";
import WorkspaceContext from "../context/WorkspaceContext";

interface ConfigPanelProps {
  onKeywordSelect: (keyword: string) => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ onKeywordSelect }) => {
  const { state } = useContext(WorkspaceContext)!;

  console.log("ConfigPanel 中的推荐关键词:", state.config.recommendedKeywords); // 添加这行日志

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">AI 推荐关键词</h2>
      <div className="flex flex-wrap gap-2">
        {state.config.recommendedKeywords.map((keyword, index) => (
          <button
            key={index}
            onClick={() => onKeywordSelect(keyword)}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors duration-200"
          >
            {keyword}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ConfigPanel;
