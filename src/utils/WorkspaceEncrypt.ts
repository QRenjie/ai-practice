import LZString from "lz-string";
import JSONUtil from "@/utils/JSONUtil";
import { WorkspaceState } from "@/types/workspace";

export class WorkspaceEncrypt {
  static encrypt(workspaceState: WorkspaceState): string {
    // 将对象转换为 JSON 字符串
    const jsonString = JSONUtil.stringify(workspaceState);
    // 使用 LZString 压缩
    const compressed = LZString.compressToEncodedURIComponent(jsonString);
    return compressed;
  }

  static decrypt(encryptedContent: string): WorkspaceState {
    // 使用 LZString 解压
    const decompressed =
      LZString.decompressFromEncodedURIComponent(encryptedContent);
    // 解析 JSON 字符串
    return JSONUtil.parse(decompressed);
  }
}
