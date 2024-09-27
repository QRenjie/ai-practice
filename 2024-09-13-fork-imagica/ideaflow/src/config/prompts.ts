export const prompts = {
  generateKeywords: {
    en: (keywordCount: number, chatHistory: string) => `
      You are an AI that can predict what the user might say next based on the conversation. Below is the conversation between the user and the AI. Please generate ${keywordCount} related keywords, phrases, or follow-up questions. These should be topics that the user might want to further explore or discuss. Each line should be a separate item without any numbering or other formatting. Here is the conversation:
      ${chatHistory}
    `,
    zh: (keywordCount: number, chatHistory: string) => `
      你是一个可以通过用户对话推测用户可能会说的下一句是什么非常智能的ai, 下面是用户和AI对话的内容，请生成${keywordCount}个相关的关键词、短语或后续问题。这些内容应该是用户可能想要进一步了解或讨论的主题。每行一个，不要有编号或其他格式, 下面是用户对话内容：
      ${chatHistory}
    `,
  },

  initRecommond1: "你能告诉我有哪些使用html创建的小应用？",
  initRecommond2:
    "请告诉我有关html文件可以创建有关列出应用的关键词， 并且这些都是基于html：计数器,时钟,待办事项清单,数字猜谜游戏,倒计时计时器,简易计算器,图片轮播,测验问答,温度转换器,颜色选择器,简易绘图板,天气应用,记忆匹配游戏,计算BMI,倒序文本,密码强度检测器,虚拟钢琴,购物车,打字速度测试,剪贴板管理器 等任何你认为可以行的都可以",
};
