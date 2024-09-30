import React, { useContext } from "react";
import WorkspaceContext from "../context/WorkspaceContext";
import { Switch, Radio, RadioChangeEvent } from "antd";

interface ConfigPanelProps {
  onKeywordSelect: (keyword: string) => void;
}

const componentTypes = [
  { value: "react", label: "React 组件" },
  { value: "html", label: "HTML 代码" },
];

const ConfigPanel: React.FC<ConfigPanelProps> = ({ onKeywordSelect }) => {
  const { state, updateConfig } = useContext(WorkspaceContext)!;

  const handleWindowedChange = (checked: boolean) => {
    updateConfig({ isWindowed: checked });
  };

  const handleComponentTypeChange = (e: RadioChangeEvent) => {
    updateConfig({ componentType: e.target.value });
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">组件类型</h3>
        <Radio.Group onChange={handleComponentTypeChange} value={state.config.componentType}>
          {componentTypes.map((type) => (
            <Radio key={type.value} value={type.value}>
              {type.label}
            </Radio>
          ))}
        </Radio.Group>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">UI 配置</h3>

        <div>
          <div className="flex items-center gap-2">
            <span>启用窗口化</span>
            <Switch checked={state.config.isWindowed} onChange={handleWindowedChange} />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">您可能想发送的建议</h3>
        <div className="flex flex-wrap gap-2">
          {state.config.recommendedKeywords.map((keyword, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onKeywordSelect(keyword)}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors duration-200"
            >
              {keyword.endsWith("?") ? `${keyword}` : `#${keyword}`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConfigPanel;
