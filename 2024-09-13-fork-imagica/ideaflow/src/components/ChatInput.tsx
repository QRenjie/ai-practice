import React from 'react';

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (e: React.KeyboardEvent<Element>) => void; // 修改这里
}

const ChatInput: React.FC<ChatInputProps> = ({
  input,
  isLoading,
  onSubmit,
  onInputChange,
  onKeyPress
}) => (
  <div className="mt-auto">
    <form onSubmit={onSubmit} className="bg-white p-4 bg-opacity-10">
      <div className="flex items-center bg-white bg-opacity-50 rounded-lg overflow-hidden">
        <input
          type="text"
          name="chatInput"  // 添加这行
          value={input}
          onChange={onInputChange}
          onKeyPress={onKeyPress}
          className="flex-grow p-3 bg-transparent focus:outline-none"
          placeholder="输入你的问题或按回车提交"
          disabled={isLoading}
        />
        <SubmitButton isLoading={isLoading} />
      </div>
    </form>
  </div>
);

const SubmitButton: React.FC<{ isLoading: boolean }> = ({ isLoading }) => (
  <button
    type="submit"
    className="bg-teal-500 text-white px-6 py-3 hover:bg-teal-600 disabled:bg-teal-300 transition-colors relative"
    disabled={isLoading}
  >
    <span className={isLoading ? 'invisible' : 'visible'}>发送</span>
    {isLoading && (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
      </div>
    )}
  </button>
);

export default ChatInput;