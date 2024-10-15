import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Components } from 'react-markdown';
import CodeBlock from './CodeBlock';

interface AIResponseProps {
  text: string;
  copyToClipboard: (text: string) => void;
  reapplyCode: (code: string) => void;
}

const AIResponse: React.FC<AIResponseProps> = React.memo(({ text, copyToClipboard, reapplyCode }) => {
  const components: Components = useMemo(() => ({
    code({ className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '')
      const codeString = String(children).replace(/\n$/, '')
      return match ? (
        <CodeBlock
          codeString={codeString}
          language={match[1]}
          copyToClipboard={copyToClipboard}
          reapplyCode={reapplyCode}
        />
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      )
    }
  }), [copyToClipboard, reapplyCode]);

  return (
    <div className="ai-response">
      <ReactMarkdown components={components}>
        {text}
      </ReactMarkdown>
    </div>
  );
});
AIResponse.displayName = 'AIResponse';
export default AIResponse;
