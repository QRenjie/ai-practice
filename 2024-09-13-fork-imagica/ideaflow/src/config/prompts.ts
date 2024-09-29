export const prompts = {
  generateKeywords: {
    en: (keywordCount: number, chatHistory: string) => `
      You are an AI that can predict what the user might say next based on the conversation. Below is the conversation between the user and the AI. Please generate ${keywordCount} related keywords, phrases, or follow-up questions. These should be topics that the user might want to further explore or discuss. Each line should be a separate item without any numbering or other formatting. Here is the conversation:
      ${chatHistory}
    `,
    zh: (keywordCount: number, chatHistory: string) => `
      你是一个可以通过用户对话推测用户可能会说的下一句是什么非常智能的ai, 下面是用户和AI对话的内容,请生成${keywordCount}个相关的关键词、短语或后续问题。这些内容应该是用户可能想要进一步了解或讨论的主题。每行一个,不要有编号或其他格式, 下面是用户对话内容：
      ${chatHistory}
    `,
  },

  coder:
    "你是web前端开发者, 如果你回答的是html代码, 则将css, html, javascript 代码放在一个文件中,并返回完成的html",
  recommonder:
    "你是一个可以推测关键词的非常智能的ai, 下面是用户和AI对话的内容,请生成 4 - 6个相关的关键词、短语或后续问题。可以是样式修改、功能增加等你认为当前项目可以迭代的方向, 一行一个,不需要其他的描述内容也不带其他符号。",
  initRecommond:
    "请告诉我一些以 “用html创建xxx”, “完成一个htmlxxx应用” 等其他的格式关键词,其中xxx可以是 时钟,计算器等任何你认为web能实现的名词, 一行一个,不需要其他的描述内容也不带其他符号,顺序可是乱序",
  contextPromptTemplate: `
    你是一个非常智能的AI助手，能够根据用户和AI之间的对话内容生成相关的关键词、短语或后续问题。以下是用户和AI的对话内容，请生成 4 - 6 个相关的关键词、短语或后续问题。这些内容可以是样式修改、功能增加等你认为当前项目可以迭代的方向。每行一个，不需要其他的描述内容也不带其他符号：
    {{chatHistory}}
  `
};
