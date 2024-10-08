import { v4 as uuidv4 } from 'uuid';
import { WorkspaceState } from '../context/WorkspaceContext';
import LZString from 'lz-string';

export class PreviewPublisher {
  static publish(workspaceState: WorkspaceState): string {
    const previewId = uuidv4();
    const encryptedContent = this.encryptWorkspaceState(workspaceState);
    
    // 返回包含加密内容的 URL
    return `/preview/${previewId}?data=${encryptedContent}`;
  }

  private static encryptWorkspaceState(workspaceState: WorkspaceState): string {
    // 将对象转换为 JSON 字符串
    const jsonString = JSON.stringify(workspaceState);
    // 使用 LZString 压缩
    const compressed = LZString.compressToEncodedURIComponent(jsonString);
    return compressed;
  }

  static decryptWorkspaceState(encryptedContent: string): WorkspaceState {
    // 使用 LZString 解压
    const decompressed = LZString.decompressFromEncodedURIComponent(encryptedContent);
    // 解析 JSON 字符串
    return JSON.parse(decompressed);
  }
}