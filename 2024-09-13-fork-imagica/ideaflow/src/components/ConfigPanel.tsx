import React, { useContext } from "react";
import WorkspaceContext from "../context/WorkspaceContext";

interface ConfigPanelProps {
  onKeywordSelect: (keyword: string) => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ onKeywordSelect }) => {
  const { state } = useContext(WorkspaceContext)!;

  return (
    <div className="">
      <h2 className="text-lg font-semibold mb-4">您可能想发送的建议</h2>
      <div className="flex flex-wrap gap-2">
        {state.config.recommendedKeywords.map((keyword, index) => (
          <button
            key={index}
            onClick={() => onKeywordSelect(keyword)}
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors duration-200"
          >
            {keyword.endsWith("?") ? `${keyword}` : `#${keyword}`}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ConfigPanel;
