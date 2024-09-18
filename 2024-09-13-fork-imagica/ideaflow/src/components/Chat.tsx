import React, { useState, useEffect, useCallback, useMemo } from "react";
import { ChatController, Message, ChatHistory } from '../services/chatService';
import ChatInput from './ChatInput';
import MessageList from './MessageList';

interface ChatProps {
  onUpdatePreview: (content: string) => void;
}

const Chat: React.FC<ChatProps> = ({ onUpdatePreview }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("用 html + css + js 做一个贪吃蛇小游戏,并支持重新开始和键盘事件的功能,并且用同一个文件");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);

  const chatController = useMemo(() => new ChatController(
    setMessages,
    setChatHistory,
    setInput,
    setIsLoading,
    onUpdatePreview
  ), [onUpdatePreview]);

  useEffect(() => {
    chatController.updatePreviewCallback(onUpdatePreview);
  }, [onUpdatePreview, chatController]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    chatController.handleSubmit(e);  // 修改这里，传入事件对象
  }, [chatController]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <MessageList messages={messages} chatController={chatController} />
      <ChatInput 
        input={input}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onInputChange={chatController.handleInputChange}
        onKeyPress={chatController.handleKeyPress}
      />
    </div>
  );
};

export default Chat;
