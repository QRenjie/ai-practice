import React, { forwardRef, useEffect, useRef, memo } from 'react';
import AIResponse from './AIResponse';
import { Message, ChatController } from '../services/chatService';

interface MessageListProps {
  messages: Message[];
  chatController: ChatController;
}

const MessageItem = memo<{ message: Message; chatController: ChatController }>(({ message, chatController }) => (
  <div className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} mb-4`}>
    <div className={`max-w-[70%] rounded-lg p-3 ${
      message.sender === "user" 
        ? "bg-indigo-100 text-indigo-900" 
        : "bg-white border border-gray-200 text-gray-900"
    }`}>
      {message.sender === "user" ? (
        <p className="whitespace-pre-wrap">{message.text}</p>
      ) : (
        <AIResponse
          text={message.text}
          copyToClipboard={chatController.copyToClipboard}
          reapplyCode={() => chatController.handleReapplyCode(message.text)}
        />
      )}
    </div>
  </div>
));

MessageItem.displayName = 'MessageItem';

const MessageList = forwardRef<HTMLDivElement, MessageListProps>(({ messages, chatController }, ref) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div ref={ref} className="flex-1 overflow-y-auto">
      <div className="h-full pb-4 space-y-4">
        {messages.map((message, index) => (
          <MessageItem 
            key={message.id || `message-${index}`} 
            message={message} 
            chatController={chatController} 
          />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
});

MessageList.displayName = 'MessageList';

export default memo(MessageList);