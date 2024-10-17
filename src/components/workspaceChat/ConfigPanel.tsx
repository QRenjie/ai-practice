import React, { useContext } from "react";
import WorkspaceContext from "@/container/WorkspaceContext";
import { Switch } from "antd";
import { useLocales } from "@/container/LocalesPovider";

interface ConfigPanelProps {
  onKeywordSelect: (keyword: string) => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ onKeywordSelect }) => {
  const { state, controller } = useContext(WorkspaceContext)!;
  const { t } = useLocales<"/creator">();

  return (
    <div data-testid="config-panel" className="flex flex-col gap-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">
          {t["workspace.title.configUi"]}
        </h3>

        <div>
          <div className="flex items-center gap-2">
            <span>{t["workspace.title.configWindowed"]}</span>
            <Switch
              checked={state.config.isWindowed}
              onChange={() => controller.store.toggleWindowed()}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">
          {t["workspace.title.configKeywords"]}
        </h3>
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
