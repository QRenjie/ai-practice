import React, { forwardRef, useEffect, useRef, memo } from "react";
import AIResponse from "./AIResponse";
import { ChatController } from "../services/chatService";
import { Message } from "@/types/apiTypes";

interface MessageListProps {
  messages: Message[];
  chatController: ChatController;
  open?: boolean;
}

const MessageItem = memo<{ message: Message; chatController: ChatController }>(
  ({ message, chatController }) => (
    <div
      className={`flex ${
        message.role === "user" ? "justify-end" : "justify-start"
      } mb-4`}
    >
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          message.role === "user"
            ? "bg-blue-100 text-blue-900"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        {message.role === "user" ? (
          <p className="whitespace-pre-wrap text-sm">{message.content}</p>
        ) : (
          <AIResponse
            text={message.content}
            copyToClipboard={chatController.copyToClipboard}
            reapplyCode={() => chatController.handleReapplyCode(message.content)}
          />
        )}
      </div>
    </div>
  )
);

MessageItem.displayName = "MessageItem";

const MessageList = forwardRef<HTMLDivElement, MessageListProps>(
  ({ messages, chatController, open }, ref) => {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (open) {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }, [messages, open]);

    return (
      <div ref={ref} className="flex-1 overflow-y-auto">
        <div className="space-y-4">
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
  }
);

MessageList.displayName = "MessageList";

export default memo(MessageList);
