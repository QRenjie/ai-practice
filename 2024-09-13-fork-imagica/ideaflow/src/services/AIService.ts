import { AiChatResponse, CodeBlock, Message } from '@/types/apiTypes';


export default class AIService {
    // 新增使用流式请求的方法
    async callOpenAIStream(message: string, messages: Message[]): Promise<AiChatResponse> {
        // 将 Message[] 转换为 API 所需的格式
        const history = messages.map(msg => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.text
        }));

        try {
            const response = await fetch("/api/ai-response", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message,
                    history,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP错误！状态：${response.status}`);
            }

            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }

            return data;
        } catch (error) {
            console.error("AI响应错误:", error);
            throw error;
        }
    }


    async execPythonCode(codeBlock: CodeBlock) {
        // 调用后端 API 处理 Python 代码
        return fetch('/api/code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(codeBlock),
        })
            .then(response => response.json())

    }

    async getRecommendedKeywords(lastMessage: string): Promise<{ keywords: string[] }> {
        try {
            const response = await fetch("/api/recommended-keywords", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ lastMessage }),
            });

            if (!response.ok) {
                throw new Error(`HTTP错误！状态：${response.status}`);
            }

            const data = await response.json();
            console.log("API 返回的数据:", data); // 添加这行日志
            return data;
        } catch (error) {
            console.error("获取推荐关键词错误:", error);
            throw error;
        }
    }

}
