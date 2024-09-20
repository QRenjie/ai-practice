import React, { useState, useCallback, useMemo } from 'react';
import WorkspaceContext, { WorkspaceState } from '../context/WorkspaceContext';
import WorkspacePreview from './WorkspacePreview';
import WorkspaceChat from './WorkspaceChat';
import WorkspaceCodeExecutor from './WorkspaceCodeExecutor';
import { Message, ChatHistory, ApplyData } from '../services/chatService';

const WorkspacePanel: React.FC = () => {
	const [state, setState] = useState<WorkspaceState>({
		activeTab: 'chat',
		previewContent: '',
		pythonCode: '',
		chatHistory: [],
		chatMessages: [],
		codeOutput: '',
	});

	const setActiveTab = useCallback((tab: WorkspaceState['activeTab']) => {
		setState(prevState => ({ ...prevState, activeTab: tab }));
	}, []);

	const updatePreview = useCallback((data: ApplyData) => {
		setState(prevState => ({ 
			...prevState, 
			previewContent: data.type === 'html' ? data.content : prevState.previewContent,
			pythonCode: data.type === 'python' ? data.content : prevState.pythonCode
		}));
	}, []);

	const updatePythonCode = useCallback((code: string) => {
		setState(prevState => ({ ...prevState, pythonCode: code }));
	}, []);

	const addChatMessage = useCallback((message: Message) => {
		setState(prevState => ({
			...prevState,
			chatMessages: [...prevState.chatMessages, message],
		}));
	}, []);

	const updateChatHistory = useCallback((history: ChatHistory[]) => {
		setState(prevState => ({ ...prevState, chatHistory: history }));
	}, []);

	const updateMessages = useCallback((updater: (prev: Message[]) => Message[]) => {
		setState(prevState => ({
			...prevState,
			chatMessages: updater(prevState.chatMessages),
		}));
	}, []);

	const updateCodeOutput = useCallback((output: string) => {
		setState(prevState => ({ ...prevState, codeOutput: output }));
	}, []);

	const contextValue = useMemo(() => ({
		state,
		setActiveTab,
		updatePreview,
		updatePythonCode,
		addChatMessage,
		updateChatHistory,
		updateMessages,
		updateCodeOutput,
	}), [state, setActiveTab, updatePreview, updatePythonCode, addChatMessage, updateChatHistory, updateMessages, updateCodeOutput]);

	return (
		<WorkspaceContext.Provider value={contextValue}>
			<div className="flex flex-col h-full bg-white shadow-lg rounded-lg overflow-hidden">
				<div className="flex border-b bg-gray-100">
					<TabButton active={state.activeTab === 'preview'} onClick={() => setActiveTab('preview')}>预览</TabButton>
					<TabButton active={state.activeTab === 'chat'} onClick={() => setActiveTab('chat')}>聊天</TabButton>
					<TabButton active={state.activeTab === 'code'} onClick={() => setActiveTab('code')}>代码</TabButton>
				</div>
				<div className="flex-1 overflow-hidden">
					{state.activeTab === 'preview' && <WorkspacePreview />}
					{state.activeTab === 'chat' && <WorkspaceChat />}
					{state.activeTab === 'code' && <WorkspaceCodeExecutor />}
				</div>
			</div>
		</WorkspaceContext.Provider>
	);
};

interface TabButtonProps {
	active: boolean;
	onClick: () => void;
	children: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, children }) => (
	<button
		className={`px-4 py-2 ${active ? 'bg-white border-b-2 border-blue-500' : 'hover:bg-gray-200'}`}
		onClick={onClick}
	>
		{children}
	</button>
);

export default WorkspacePanel;