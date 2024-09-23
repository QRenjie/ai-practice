import React from 'react';
import { ChatHistory, ApplyData } from '../services/chatService';
import { CodeBlock, Message } from '@/types/apiTypes';

export interface WorkspaceState {
  activeTab: 'preview' | 'chat' | 'code' | 'codeHistory';
  previewContent: string;
  chatHistory: ChatHistory[];
  chatMessages: Message[];
  mergedCodeBlocks: CodeBlock[]; // 新增状态
}

export interface WorkspaceContextType {
  state: WorkspaceState;
  setActiveTab: (tab: WorkspaceState['activeTab']) => void;
  updatePreview: (data: ApplyData) => void;
  addChatMessage: (message: Message) => void;
  updateChatHistory: (history: ChatHistory[]) => void;
  updateMessages: (updater: (prev: Message[]) => Message[]) => void;
  updateMergedCodeBlocks: (blocks: CodeBlock[]) => void; // 新增方法
}

const WorkspaceContext = React.createContext<WorkspaceContextType | null>(null);

export default WorkspaceContext;