import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface AIResponseProps {
  text: string;
  copyToClipboard: (text: string) => void;
  reapplyCode: () => void;
}

const AIResponse: React.FC<AIResponseProps> = ({ text, copyToClipboard, reapplyCode }) => {
  const hasCodeBlocks = text.includes("```");

  if (!hasCodeBlocks) {
    // Treat the entire text as a single HTML code block
    return (
      <div className="inline-block max-w-full bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-end mb-2">
          <button
            onClick={reapplyCode}
            className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600"
          >
            重新应用代码
          </button>
        </div>
        <div className="mb-4 rounded-md overflow-hidden">
          <div className="flex bg-gray-800 px-4 py-2 text-xs font-mono text-gray-200 items-center">
            <span>html</span>
            <button
              onClick={() => copyToClipboard(text)}
              className="ml-auto flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy
            </button>
          </div>
          <SyntaxHighlighter
            language="html"
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              borderRadius: "0 0 0.375rem 0.375rem",
            }}
          >
            {text}
          </SyntaxHighlighter>
        </div>
      </div>
    );
  }

  // Existing code for handling multiple code blocks
  const handleReapply = () => {
    reapplyCode();
  };

  return (
    <div className="inline-block max-w-full bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-end mb-2">
        <button
          onClick={handleReapply}
          className="bg-green-500 text-white px-2 py-1 rounded text-sm hover:bg-green-600"
        >
          重新应用代码
        </button>
      </div>
      {text.split("```").map((part, i) =>
        i % 2 === 0 ? (
          <p key={i} className="text-gray-700 mb-4 leading-relaxed">
            {part}
          </p>
        ) : (
          <div key={i} className="mb-4 rounded-md overflow-hidden">
            {(() => {
              const lines = part.trim().split('\n');
              const language = lines[0].trim();
              const code = lines.slice(1).join('\n').trim();
              return (
                <>
                  <div className="flex bg-gray-800 px-4 py-2 text-xs font-mono text-gray-200 items-center">
                    <span>{language || 'code'}</span>
                    <button
                      onClick={() => copyToClipboard(code)}
                      className="ml-auto flex items-center gap-1 text-gray-400 hover:text-white transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </button>
                  </div>
                  <SyntaxHighlighter
                    language={language || 'javascript'}
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      borderRadius: "0 0 0.375rem 0.375rem",
                    }}
                  >
                    {code}
                  </SyntaxHighlighter>
                </>
              );
            })()}
          </div>
        )
      )}
    </div>
  );
};

export default AIResponse;
