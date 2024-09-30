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
            return [{ fileName: '', language: 'html', content: markdownContent }];
        }

        while ((match = codeBlockRegex.exec(markdownContent)) !== null) {
            const language = match[1];
            const fileName = match[2] || this.extractFileName(match[3]); // 提取文件名
            const code = match[3].trim();
            codeBlocks.push({ fileName, language, content: code });
        }

        return codeBlocks;
    }

    private static extractFileName(code: string): string {
        const firstLine = code.split('\n')[0]; // 获取代码的第一行
        const match = firstLine.match(/\/\/\s+(.+?)\s*$/); // 匹配 // 后的文件名
        return match ? match[1].trim() : ''; // 返回文件名或空字符串
    }

    static isHtml(markdownContent: string): boolean {
        // 移除开头的空白字符
        const trimmedContent = markdownContent.trim();
        
        // 检查是否以<!DOCTYPE html>、<html>或任何HTML标签开头
        const htmlPatterns = [
            /^<!DOCTYPE\s+html\s*>/i,
            /^<html\b/i,
            /^<([a-z]+)(?:\s|>)/i
        ];

        return htmlPatterns.some(pattern => pattern.test(trimmedContent));
    }
}

