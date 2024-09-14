interface CodeExtractor {
    extract(content: string): { htmlCode: string; cssCode: string; jsCode: string };
}

export class CodeExtractorImpl implements CodeExtractor {
    extract(content: string): { htmlCode: string; cssCode: string; jsCode: string } {
        if (content.trim().startsWith('<')) {
            return this.extractFullHtml(content);
        } else {
            return this.extractCodeBlocks(content);
        }
    }

    private extractFullHtml(content: string) {
        let htmlCode = content;
        let cssCode = "";
        let jsCode = "";

        const styleMatch = htmlCode.match(/<style>([\s\S]*?)<\/style>/);
        const scriptMatch = htmlCode.match(/<script>([\s\S]*?)<\/script>/);

        if (styleMatch) {
            cssCode = styleMatch[1];
            htmlCode = htmlCode.replace(styleMatch[0], '');
        }
        if (scriptMatch) {
            jsCode = scriptMatch[1];
            htmlCode = htmlCode.replace(scriptMatch[0], '');
        }

        return { htmlCode, cssCode, jsCode };
    }

    private extractCodeBlocks(content: string) {
        let htmlCode = "";
        let cssCode = "";
        let jsCode = "";

        const codeBlocks = content.match(/```(\w+)?\n([\s\S]*?)```/g) || [];
        codeBlocks.forEach((block) => {
            const [, language, code] = block.match(/```(\w+)?\n([\s\S]*?)```/) || [];
            const lowerLanguage = language?.toLowerCase();
            if (lowerLanguage === 'html') {
                htmlCode += code + '\n';
            } else if (lowerLanguage === 'css') {
                cssCode += code + '\n';
            } else if (lowerLanguage === 'javascript' || lowerLanguage === 'js') {
                jsCode += code + '\n';
            }
        });

        return { htmlCode, cssCode, jsCode };
    }

    generateHtmlContent(htmlCode: string, cssCode: string, jsCode: string): string {
        if (htmlCode.trim().startsWith('<html') || htmlCode.trim().startsWith('<!DOCTYPE html')) {
            return htmlCode;
        } else {
            return `
                <!DOCTYPE html>
                <html lang="en">
                  <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <style>${cssCode}</style>
                  </head>
                  <body>
                    ${htmlCode}
                    <script>${jsCode}</script>
                  </body>
                </html>
            `;
        }
    }
}

