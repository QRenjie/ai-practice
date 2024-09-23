import React, { useContext, useMemo, useEffect } from 'react';
import WorkspaceContext from '../context/WorkspaceContext';
import { CodeBlock } from '../types/apiTypes';
import * as Diff from 'diff';
import CodeBlockComponet from './CodeBlock';

const WorkspaceCodeHistory: React.FC = () => {
    const { state, updateMergedCodeBlocks } = useContext(WorkspaceContext)!;

    const mergeCodeBlocks = (blocks1: CodeBlock[], blocks2: CodeBlock[]): CodeBlock[] => {
        const mergedBlocks: CodeBlock[] = [];

        const map1 = new Map(blocks1.map(block => [block.fileName, block]));
        const map2 = new Map(blocks2.map(block => [block.fileName, block]));

        const allFileNames = new Set([...map1.keys(), ...map2.keys()]);

        allFileNames.forEach(fileName => {
            const block1 = map1.get(fileName);
            const block2 = map2.get(fileName);

            if (block1 && block2) {
                // 如果两个块都存在，使用 diff 库来计算差异并合并代码
                const diff = Diff.diffLines(block1.code, block2.code);
                const mergedCode = diff.map(part => {
                    return part.value;
                }).join('');
                mergedBlocks.push({
                    fileName,
                    language: block1.language,
                    code: mergedCode
                });
            } else if (block1) {
                mergedBlocks.push(block1);
            } else if (block2) {
                mergedBlocks.push(block2);
            }
        });

        return mergedBlocks;
    };

    const codeContent: CodeBlock[] = useMemo(() => {
        const aiMessages = state.chatMessages.filter((msg) =>
            msg.sender === 'bot' && Array.isArray(msg.codeBlocks) && msg.codeBlocks.length > 0
        );
        if (aiMessages.length === 0) return [];

        if (aiMessages.length === 1) {
            return aiMessages[0].codeBlocks || [];
        }

        const lastTwoMessages = aiMessages.slice(-2);
        const [lastMessage, secondLastMessage] = lastTwoMessages;

        return mergeCodeBlocks(secondLastMessage.codeBlocks || [], lastMessage.codeBlocks || []);
    }, [state.chatMessages]);

    useEffect(() => {
        if (codeContent.length > 0) {
            updateMergedCodeBlocks(codeContent);
        }
    }, [codeContent, updateMergedCodeBlocks]);

    return (
        <div className="p-4 overflow-auto h-full">
            {codeContent.length > 0 ? (
                codeContent.map((block, index) => (
                    <div key={index} className="mb-4">
                        <h3 className="text-lg font-bold">{block.fileName} ({block.language})</h3>
                        <CodeBlockComponet
                            codeString={block.code} language={block.language} copyToClipboard={function (): void {
                                throw new Error('Function not implemented.');
                            }} reapplyCode={function (): void {
                                throw new Error('Function not implemented.');
                            }} />
                    </div>
                ))
            ) : (
                <p>没有代码历史</p>
            )}
        </div>
    );
};

export default WorkspaceCodeHistory;