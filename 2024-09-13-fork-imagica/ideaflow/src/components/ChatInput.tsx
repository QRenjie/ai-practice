import React from "react";

interface ChatInputProps {
  inputRef: React.RefObject<HTMLInputElement>;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const ChatInput: React.FC<ChatInputProps> = React.memo(
  ({
    inputRef,
    isLoading,
    onSubmit,
    onKeyPress,
    isCollapsed,
    onToggleCollapse,
  }) => (
    <form onSubmit={onSubmit} className="flex items-center p-2 bg-white border-t border-gray-300">
      {/* 输入框 */}
      <input
        ref={inputRef}
        type="text"
        name="chatInput"
        onKeyPress={onKeyPress}
        className="flex-grow p-2 text-gray-800 placeholder-gray-500 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 rounded-md"
        placeholder="输入你的问题或按回车提交"
        disabled={isLoading}
        defaultValue=""
      />
      {/* 右侧按钮组 */}
      <div className="flex items-center space-x-2 ml-2">
        {/* 发送按钮 */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 disabled:bg-blue-300 transition-colors duration-300 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md"
          disabled={isLoading}
        >
          {isLoading ? "发送中..." : "发送"}
        </button>
        {/* 折叠/展开按钮 */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 focus:outline-none rounded-md"
        >
          {isCollapsed ? "展开" : "折叠"}
        </button>
      </div>
    </form>
  )
);

ChatInput.displayName = "ChatInput";

export default ChatInput;
