export const prompts = {
  generateKeywords: {
    en: (keywordCount: number, chatHistory: string) => `
      You are an AI that can predict what the user might say next based on the conversation. Below is the conversation between the user and the AI. Please generate ${keywordCount} related keywords, phrases, or follow-up questions. These should be topics that the user might want to further explore or discuss. Each line should be a separate item without any numbering or other formatting. Here is the conversation:
      ${chatHistory}
    `,
    zh: (keywordCount: number, chatHistory: string) => `
      你是一个可以通过用户对话推测用户可能会说的下一句是什么, 下面是用户和AI对话的内容，请生成${keywordCount}个相关的关键词、短语或后续问题。这些内容应该是用户可能想要进一步了解或讨论的主题。每行一个，不要有编号或其他格式, 下面是用户对话内容：
      ${chatHistory}
    `,
  },
};