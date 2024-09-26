function ChatFooter({
  handleTogglePanel,
  openPanel,
  loading,
  handleSubmit,
}: {
  handleTogglePanel: (panel: "messages" | "config") => void;
  openPanel: string;
  loading?: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}) {
  // const workspaceContext = useContext(WorkspaceContext)!;
  // const { state } = workspaceContext;

  // const getButtonClass = (panel: "messages" | "config") => {
  //   const baseClass =
  //     "px-1 py-0.5 rounded-md focus:outline-none transition-colors duration-200";
  //   const activeClass = "bg-blue-500 text-white hover:bg-blue-600";
  //   const inactiveClass = "bg-gray-200 text-gray-700 hover:bg-gray-300";
  //   return `${baseClass} ${openPanel === panel ? activeClass : inactiveClass}`;
  // };

  return (
    <div className="w-full flex justify-between">
      <div>{/* <button>{state.config.selectedModel}</button> */}</div>

      <ul className="menu menu-horizontal p-0">
        <li>
          <a className="p-1" onClick={() => handleTogglePanel("messages")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
          </a>
        </li>
        <li>
          <a className="p-1" onClick={() => handleTogglePanel("config")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </a>
        </li>
        <li>
          <a className="p-1" onClick={handleSubmit}>
            <kbd className="kbd kbd-xs text-[0.5rem]">Enter</kbd>
            {loading ? "发送..." : "发送"}
          </a>
        </li>
      </ul>
      {/* <div className="flex gap-2">
        <button
          type="button"
          onClick={() => handleTogglePanel("messages")}
          className={getButtonClass("messages")}
        >
          对话
          <kbd className="kbd kbd-xs">Ctrl+K</kbd>
        </button>
        <button
          type="button"
          onClick={() => handleTogglePanel("config")}
          className={getButtonClass("config")}
        >
          配置
          <kbd className="kbd kbd-xs">Ctrl+L</kbd>
        </button>
        <button type="button">
          <span>发送</span>
          <kbd className="kbd kbd-xs">Enter</kbd>
        </button>
      </div> */}
    </div>
  );
}

export default ChatFooter;
