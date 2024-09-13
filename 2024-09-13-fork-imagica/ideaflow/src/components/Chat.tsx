import React, { useState } from "react";
import AIResponse from './AIResponse';

interface Message {
  text: string;
  sender: "user" | "bot";
  type: "text" | "code";
}

interface ChatProps {
  onUpdatePreview: (content: string) => void;
}

const Chat: React.FC<ChatProps> = ({ onUpdatePreview }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("用 html + css + js 做一个贪吃蛇小游戏,并支持重新开始和键盘事件的功能");
  const [isLoading, setIsLoading] = useState(false);

  async function callOpenAI(
    message: string
  ): Promise<{ text: string; type: "text" | "code" }[]> {
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
            messages: [{ role: "user", content: message }],
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

      const content = data.choices[0].message.content;

      const parts = content.split("```");
      return parts.map((part: string, index: number) => ({
        text: part.trim(),
        type: index % 2 === 1 ? "code" : "text",
      }));
    } catch (error) {
      console.error("Error in callOpenAI:", error);
      return [
        {
          text: "An error occurred while processing your request.",
          type: "text",
        },
      ];
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user", type: "text" }]);
      setIsLoading(true);

      try {
        const aiResponse = await callOpenAI(input);
        const combinedResponse = aiResponse
          .map((part) =>
            part.type === "code" ? `\`\`\`\n${part.text}\n\`\`\`` : part.text
          )
          .join("\n\n");

        setMessages((prev) => [
          ...prev,
          { text: combinedResponse, sender: "bot", type: "text" },
        ]);

        // Extract HTML, CSS, and JavaScript code
        let htmlCode = "";
        let cssCode = "";
        let jsCode = "";

        aiResponse.forEach((part) => {
          if (part.type === "code") {
            const lines = part.text.split('\n');
            const language = lines[0].trim().toLowerCase();
            const code = lines.slice(1).join('\n');

            if (language === 'html') {
              htmlCode += code;
            } else if (language === 'css') {
              cssCode += code;
            } else if (language === 'javascript') {
              jsCode += code;
            }
          }
        });

        // Clean the code (remove potential extra whitespace)
        const cleanCode = (code: string) => code.trim();
        const cleanHtmlCode = cleanCode(htmlCode);
        const cleanCssCode = cleanCode(cssCode);
        const cleanJsCode = cleanCode(jsCode);

        // Combine the code into a single HTML document
        const fullHtmlContent = `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>${cleanCssCode}</style>
            </head>
            <body>
              ${cleanHtmlCode}
              <script>${cleanJsCode}</script>
            </body>
          </html>
        `;

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

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] ${
                message.sender === "user"
                  ? "bg-blue-100 rounded-l-lg rounded-br-lg"
                  : ""
              }`}
            >
              {message.sender === "user" ? (
                <div className="p-3 rounded-lg">
                  <p className="whitespace-pre-wrap break-words">{message.text}</p>
                </div>
              ) : (
                <AIResponse text={message.text} copyToClipboard={copyToClipboard} />
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
