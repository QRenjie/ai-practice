import React from "react";

interface ConfigPanelProps {
  onKeywordSelect: (keyword: string) => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ onKeywordSelect }) => {
  const keywords = [
    "调整样式",
    "使用 tailwindcss 对ui进行调整",
    "优化ui让它更具有创造性",
    "代码优化",
    "功能实现",
    "错误修复",
  ];

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">常用关键词</h2>
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword, index) => (
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
