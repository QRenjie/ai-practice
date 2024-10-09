import { CodeBlock, Message } from "@/types/apiTypes";
import { SandpackFiles } from "@codesandbox/sandpack-react";

export class CodeBlocks {
  static mergeCodeBlocks(
    previousMergedBlocks: CodeBlock[],
    newMessage: Message
  ): CodeBlock[] {
    if (!newMessage.codeBlocks || newMessage.codeBlocks.length === 0) {
      return previousMergedBlocks;
    }

    const mergedBlocks: CodeBlock[] = [];
    const previousBlocksMap = new Map(
      previousMergedBlocks.map((block) => [block.fileName, block])
    );

    // 遍历新代码块
    newMessage.codeBlocks.forEach((newBlock) => {
      const prevBlock = previousBlocksMap.get(newBlock.fileName);
      if (prevBlock) {
        // 如果文件名相同，合并代码块
        const mergedContent = this.mergeCode(
          prevBlock.content,
          newBlock.content
        );
        mergedBlocks.push({ ...newBlock, content: mergedContent });
      } else {
        // 如果是新的文件，直接添加
        mergedBlocks.push(newBlock);
      }
      // 从映射中删除已处理的文件
      previousBlocksMap.delete(newBlock.fileName);
    });

    // 添加剩余的旧代码块（在新代码中未出现的文件）
    previousBlocksMap.forEach((block) => {
      mergedBlocks.push(block);
    });

    return mergedBlocks;
  }

  static mergeCode(oldCode: string, newCode: string): string {
    // 这里可以使用更复杂的算法来合并代码
    // 例如，使用diff算法来找到差异并合并
    return newCode; // 简单替换，实际应用中需要更复杂的逻辑
  }

  /**
   * 将 SandpackFiles 类型转换为 CodeBlock[] 类型
   * @param files SandpackFiles 类型的文件对象
   * @returns CodeBlock[] 类型的数组
   */
  static convertFilesToCodeBlocks(files: SandpackFiles): CodeBlock[] {
    return Object.entries(files).map(([filePath, fileContent]) => ({
      fileName: filePath,
      content: typeof fileContent === "string" ? fileContent : fileContent.code,
      language: CodeBlocks.getLanguageFromFilePath(filePath),
    }));
  }

  /**
   * 根据文件路径获取语言类型
   * @param filePath 文件路径
   * @returns 语言类型字符串
   */
  static getLanguageFromFilePath(filePath: string): string {
    const extension = filePath.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "js":
      case "jsx":
        return "javascript";
      case "ts":
      case "tsx":
        return "typescript";
      case "css":
        return "css";
      case "html":
        return "html";
      default:
        return "plaintext";
    }
  }
}
