import { CodeBlock, Message } from "@/types/apiTypes";

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
        // 如果文件名相同，选择替换或合并
        // 这里选择替换旧的代码块
        mergedBlocks.push(newBlock);
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
}
