import React from 'react';
import AIResponse from './AIResponse';
import { Message, ChatController } from '../services/chatService';

interface MessageListProps {
  messages: Message[];
  chatController: ChatController;
}

const MessageItem: React.FC<{ message: Message; chatController: ChatController }> = ({ message, chatController }) => (
  <div className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
    <div className={`max-w-full rounded-2xl p-4 break-words ${
      message.sender === "user" ? "bg-teal-100 text-teal-900" : "bg-white text-gray-900"
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
);

const MessageList: React.FC<MessageListProps> = ({ messages, chatController }) => (
  <div className="flex-1 overflow-y-auto">
    <div className="h-full px-4 pb-4 space-y-4">
      {messages.map((message, index) => (
        <MessageItem key={index} message={message} chatController={chatController} />
      ))}
    </div>
  </div>
);

export default MessageList;