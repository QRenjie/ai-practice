import React, { useEffect, useContext } from "react";
import WorkspaceContext from "../context/WorkspaceContext";
import AIService from "../services/AIService";

interface ConfigPanelProps {
  onKeywordSelect: (keyword: string) => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ onKeywordSelect }) => {
  const { state, updateRecommendedKeywords } = useContext(WorkspaceContext)!;
  const aiService = new AIService();

  useEffect(() => {
    updateRecommendedKeywordsFromAI();
  }, [state.chat.messages]);

  const updateRecommendedKeywordsFromAI = async () => {
    if (state.chat.messages.length > 0) {
      const lastMessage = state.chat.messages[state.chat.messages.length - 1];
      try {
        const response = await aiService.getRecommendedKeywords(
          lastMessage.text
        );
        updateRecommendedKeywords(response.keywords);
      } catch (error) {
        console.error("获取推荐关键词失败:", error);
      }
    }
  };

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
