import React, { useContext, useRef, useMemo, useState, useCallback, useEffect } from 'react';
import WorkspaceContext from '../context/WorkspaceContext';
import { ChatController } from '../services/chatService';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

const WorkspaceChat: React.FC = () => {
  const { state, addChatMessage, updateChatHistory, updatePreview, updateMessages } = useContext(WorkspaceContext)!;
  const inputRef = useRef<HTMLInputElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const chatController = useMemo(() => {
    const controller = new ChatController(
      addChatMessage,
      updateChatHistory,
      setIsLoading,
      updatePreview,
      state,
      updateMessages
    );
    controller.setInputRef(inputRef);
    return controller;
  }, []);

  useEffect(() => {
    chatController.state = state;
  }, [state]);

  // useEffect(() => {
  //   chatController.updatePreviewCallback((data: { type: 'html' | 'python', content: string }) => onUpdatePreview(data));
  // }, [onUpdatePreview, chatController]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [state.chatMessages]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      chatController.handleSubmit(e)
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
          messages={state.chatMessages}
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

export default WorkspaceChat;