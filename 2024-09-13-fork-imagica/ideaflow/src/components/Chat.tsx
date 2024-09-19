import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { ChatController, Message, ChatHistory, OnUpdatePreviewCallback } from "../services/chatService";
import ChatInput from "./ChatInput";
import MessageList from "./MessageList";

interface ChatProps {
  onUpdatePreview: OnUpdatePreviewCallback;
}

const Chat: React.FC<ChatProps> = ({ onUpdatePreview }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [, setChatHistory] = useState<ChatHistory[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);

  const chatController = useMemo(
    () =>
      new ChatController(
        setMessages,
        setChatHistory,
        setIsLoading,
        onUpdatePreview,
        inputRef
      ),
    [onUpdatePreview]
  );

  useEffect(() => {
    chatController.updatePreviewCallback((data: { type: 'html' | 'python', content: string }) => onUpdatePreview(data));
  }, [onUpdatePreview, chatController]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      chatController.handleSubmit(e);
    },
    [chatController]
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e as unknown as React.FormEvent);
      }
    },
    [handleSubmit]
  );

  return (
    <div className="flex flex-col h-full bg-gray-100 bg-opacity-10">
      <div className="flex-1 overflow-y-auto p-4">
        <MessageList
          ref={messageListRef}
          messages={messages}
          chatController={chatController}
        />
      </div>
      <div className="border-t border-gray-300 border-opacity-30 p-4 bg-black bg-opacity-10">
        <ChatInput
          inputRef={inputRef}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          onKeyPress={handleKeyPress}
        />
      </div>
    </div>
  );
};

Chat.displayName = "Chat";

export default React.memo(Chat);
