import { v4 as uuidv4 } from 'uuid';
import { WorkspaceState } from '../context/WorkspaceContext';

export class PreviewPublisher {
  static async publish(workspaceState: WorkspaceState): Promise<string | null> {
    const previewId = uuidv4();
    const previewContent = this.generatePreviewContent(workspaceState);
    
    try {
      const response = await fetch('/api/save-preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: previewId,
          content: previewContent,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.previewUrl;
      } else {
        throw new Error('发布预览失败');
      }
    } catch (error) {
      console.error('发布预览时出错:', error);
      return null;
    }
  }

  private static generatePreviewContent(workspaceState: WorkspaceState): string {
    const { files, template } = workspaceState;

    switch (template) {
      case 'static-html':
        return this.generateStaticHtmlPreview(files);
      case 'react-base':
        return this.generateReactPreview(files);
      default:
        throw new Error('不支持的模板类型');
    }
  }

  private static generateStaticHtmlPreview(files: Record<string, string>): string {
    const htmlContent = files['index.html'] || '';
    const cssContent = files['styles.css'] ? `<style>${files['styles.css']}</style>` : '';
    const jsContent = files['script.js'] ? `<script>${files['script.js']}</script>` : '';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          ${cssContent}
        </head>
        <body>
          ${htmlContent}
          ${jsContent}
        </body>
      </html>
    `;
  }

  private static generateReactPreview(files: Record<string, string>): string {
    // 这里我们需要生成一个基本的 React 应用结构
    const appContent = files['App.js'] || '';
    const indexContent = files['index.js'] || '';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
        </head>
        <body>
          <div id="root"></div>
          <script type="text/babel">
            ${appContent}
            ${indexContent}
          </script>
        </body>
      </html>
    `;
  }
}