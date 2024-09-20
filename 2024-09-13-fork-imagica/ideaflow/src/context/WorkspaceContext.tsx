import React from 'react';
import { Message, ChatHistory, ApplyData } from '../services/chatService';

export interface WorkspaceState {
  activeTab: 'preview' | 'chat' | 'code';
  previewContent: string;
  pythonCode: string;
  chatHistory: ChatHistory[];
  chatMessages: Message[];
  codeOutput: string;
}

export type WorkspaceContextType = {
  state: WorkspaceState;
  setActiveTab: (tab: WorkspaceState['activeTab']) => void;
  updatePreview: (data: ApplyData) => void; // 更新这里
  updatePythonCode: (code: string) => void;
  addChatMessage: (message: Message) => void;
  updateChatHistory: (history: ChatHistory[]) => void;
  updateMessages: (updater: (prev: Message[]) => Message[]) => void;
  updateCodeOutput: (output: string) => void;
};

const WorkspaceContext = React.createContext<WorkspaceContextType | null>(null);

export default WorkspaceContext;