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
  const [input, setInput] = useState("用 html + css + js 做一个贪吃蛇小游戏,并支持重新开始和键盘事件的功能,并且用同一个文件");
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
    if (input.trim()) {
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
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"
              }`}
          >
            <div
              className={`max-w-[70%] ${message.sender === "user"
                ? "bg-blue-100 rounded-l-lg rounded-br-lg"
                : ""
                }`}
            >
              {message.sender === "user" ? (
                <div className="p-3 rounded-lg">
                  <p className="whitespace-pre-wrap break-words">{message.text}</p>
                </div>
              ) : (
                <AIResponse text={message.text} copyToClipboard={copyToClipboard} reapplyCode={() => handleReapplyCode(message.text)} />
              )}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
        <div className="flex flex-col">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full border rounded p-2 mb-2 resize-none"
            placeholder="输入你的问题或按回车提交默认问题"
            disabled={isLoading}
            rows={3}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
              disabled={isLoading}
            >
              Send
            </button>
          </div>
        </div>
        {isLoading && (
          <div className="mt-2 flex justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
          </div>
        )}
      </form>
    </div>
  );
};

export default Chat;
