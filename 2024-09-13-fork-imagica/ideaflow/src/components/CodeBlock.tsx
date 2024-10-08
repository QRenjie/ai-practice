
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';


interface CodeBlockProps {
    codeString: string;
    language: string;
    copyToClipboard: (text: string) => void;
    reapplyCode: (code: string) => void;
}

const IconButton: React.FC<{ onClick: () => void; title: string; children: React.ReactNode }> = ({ onClick, title, children }) => (
    <button
        onClick={onClick}
        className="bg-gray-700 hover:bg-gray-600 text-white p-1 rounded"
        title={title}
    >
        {children}
    </button>
);

const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
        <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
    </svg>
);

const ApplyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);


const CodeBlock: React.FC<CodeBlockProps> = React.memo(({ codeString, language, copyToClipboard, reapplyCode }) => (
    <div className="relative">
        <div className="absolute top-2 right-2 flex space-x-1">
            <IconButton onClick={() => copyToClipboard(codeString)} title="复制代码">
                <CopyIcon />
            </IconButton>
            <IconButton onClick={() => reapplyCode(codeString)} title="应用代码">
                <ApplyIcon />
            </IconButton>
        </div>
        <SyntaxHighlighter
            style={vscDarkPlus}
            language={language}
            PreTag="div"
        >
            {codeString}
        </SyntaxHighlighter>
    </div>
));
CodeBlock.displayName = 'CodeBlock';
export default CodeBlock;  