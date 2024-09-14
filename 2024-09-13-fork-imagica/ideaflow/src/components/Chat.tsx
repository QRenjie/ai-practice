import React, { useState } from "react";
import AIResponse from './AIResponse';
import { CodeExtractorImpl } from '../utils/CodeExtractor';

interface Message {
  text: string;
  sender: "user" | "bot";
  type: "text" | "code" | "markdown";
}

interface ChatProps {
  onUpdatePreview: (content: string) => void;
}

const Chat: React.FC<ChatProps> = ({ onUpdatePreview }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("用 html + css + js 做一个贪吃蛇小游戏, 增加一个重新开始的按钮,将html,css,js都输入到一个html文件,如果游戏结束不要使用alert,而是使用一个按钮,点击按钮后重新开始游戏");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);

  async function callOpenAI(message: string, history: { role: string; content: string }[]): Promise<string> {
    try {
      const response = await fetch(
        "http://openai-proxy.brain.loocaa.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer DlJYSkMVj1x4zoe8jZnjvxfHG6z5yGxK",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [...history, { role: "user", content: message }],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (
        !data.choices ||
        !data.choices[0] ||
        !data.choices[0].message ||
        !data.choices[0].message.content
      ) {
        throw new Error("Unexpected response structure from OpenAI API");
      }

      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error in callOpenAI:", error);
      return "An error occurred while processing your request.";
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendMessage();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (input.trim() && !isLoading) {
      const userMessage = { role: "user", content: input };
      setMessages([...messages, { text: input, sender: "user", type: "text" }]);
      setChatHistory([...chatHistory, userMessage]);
      setIsLoading(true);

      try {
        const aiResponse = await callOpenAI(input, chatHistory);
        const botMessage = { role: "assistant", content: aiResponse };
        setMessages((prev) => [
          ...prev,
          { text: aiResponse, sender: "bot", type: "markdown" },
        ]);
        setChatHistory((prev) => [...prev, botMessage]);

        const extractor = new CodeExtractorImpl();
        const { htmlCode, cssCode, jsCode } = extractor.extract(aiResponse);
        const fullHtmlContent = extractor.generateHtmlContent(htmlCode, cssCode, jsCode);

        onUpdatePreview(fullHtmlContent);
      } catch (error) {
        console.error("Error:", error);
        setMessages((prev) => [
          ...prev,
          { text: "Sorry, an error occurred.", sender: "bot", type: "text" },
        ]);
      } finally {
        setIsLoading(false);
      }

      setInput("");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        // Optionally, you can show a "Copied!" message here
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  const handleReapplyCode = (text: string) => {
    const extractor = new CodeExtractorImpl();
    const { htmlCode, cssCode, jsCode } = extractor.extract(text);
    const fullHtmlContent = extractor.generateHtmlContent(htmlCode, cssCode, jsCode);
    onUpdatePreview(fullHtmlContent);
  };

  return (
    <div className="flex flex-col h-full bg-white bg-opacity-80 backdrop-blur-md rounded-lg shadow-lg">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] ${
                message.sender === "user"
                  ? "bg-blue-500 text-white rounded-l-2xl rounded-br-2xl"
                  : "bg-gray-200 rounded-r-2xl rounded-bl-2xl"
              }`}
            >
              {message.sender === "user" ? (
                <div className="p-4 rounded-lg">
                  <p className="whitespace-pre-wrap break-words">{message.text}</p>
                </div>
              ) : (
                <AIResponse text={message.text} copyToClipboard={copyToClipboard} reapplyCode={() => handleReapplyCode(message.text)} />
              )}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="p-6 bg-white bg-opacity-50 backdrop-blur-sm border-t rounded-b-lg">
        <div className="flex flex-col">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full border-2 border-gray-300 rounded-lg p-3 mb-3 resize-none focus:outline-none focus:border-blue-500 transition duration-300"
            placeholder="输入你的问题或按回车提交默认问题"
            disabled={isLoading}
            rows={3}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 disabled:bg-blue-300 transition duration-300 transform hover:scale-105"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  处理中...
                </div>
              ) : (
                "发送"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Chat;
