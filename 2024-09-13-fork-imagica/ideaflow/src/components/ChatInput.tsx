import React from "react";

interface ChatInputProps {
  inputRef: React.RefObject<HTMLInputElement>;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isCollapsed: boolean; // 新增
  onToggleCollapse: () => void; // 新增
}

const ChatInput: React.FC<ChatInputProps> = React.memo(
  ({ inputRef, isLoading, onSubmit, onKeyPress, isCollapsed, onToggleCollapse }) => (
    <form onSubmit={onSubmit} className="flex items-center">
      {/* 输入框 */}
      <input
        ref={inputRef}
        type="text"
        name="chatInput"
        onKeyPress={onKeyPress}
        className="flex-grow p-3 text-gray-800 placeholder-gray-500 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
        placeholder="输入你的问题或按回车提交"
        disabled={isLoading}
        defaultValue=""
      />
      {/* 折叠/展开图标按钮，移动到右侧 */}
      <button
        type="button"
        onClick={onToggleCollapse}
        className="px-2 focus:outline-none"
      >
        {isCollapsed ? (
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {/* 展开图标 */}
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8l8 8 8-8" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {/* 折叠图标 */}
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 16l-8-8-8 8" />
          </svg>
        )}
      </button>
      {/* 发送按钮 */}
      <SubmitButton isLoading={isLoading} />
    </form>
  )
);

ChatInput.displayName = "ChatInput";

const SubmitButton: React.FC<{ isLoading: boolean }> = React.memo(
  ({ isLoading }) => (
    <button
      type="submit"
      className="bg-blue-500 text-white px-4 py-3 hover:bg-blue-600 disabled:bg-blue-300 transition-colors duration-300 focus:outline-none focus:ring-1 focus:ring-blue-500 relative rounded-r-lg"
      disabled={isLoading}
    >
      <span className={isLoading ? "invisible" : "visible"}>发送</span>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}
    </button>
  )
);

SubmitButton.displayName = "SubmitButton";

export default ChatInput;
