import { CodeBlock } from "@/types/apiTypes";

/**
 * 从markdown内容中提取代码块
 */
export class CodeExtractor {

    static extract(markdownContent: string): CodeBlock[] {
        const codeBlockRegex = /```(\w+)(?::(\S+))?\n([\s\S]*?)```/g;
        const codeBlocks: CodeBlock[] = [];
        let match;

        if (CodeExtractor.isHtml(markdownContent)) {
            return [{ fileName: '', language: 'html', code: markdownContent }];
        }

        while ((match = codeBlockRegex.exec(markdownContent)) !== null) {
            const language = match[1];
            const fileName = match[2] || '';
            const code = match[3].trim();
            codeBlocks.push({ fileName, language, code });
        }

        return codeBlocks;
    }

    static isHtml(markdownContent: string): boolean {
        const htmlPattern = /<\/?[a-z][\s\S]*>/i;
        return htmlPattern.test(markdownContent);
    }
}

