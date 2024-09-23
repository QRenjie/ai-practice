import { CodeBlock, Message } from "@/types/apiTypes";
import * as Diff from "diff";

export class CodeBlocks {
  static extractCodeBlocks(
    blocks1: CodeBlock[],
    blocks2: CodeBlock[]
  ): CodeBlock[] {
    const mergedBlocks: CodeBlock[] = [];

    const map1 = new Map(blocks1.map((block) => [block.fileName, block]));
    const map2 = new Map(blocks2.map((block) => [block.fileName, block]));

    const allFileNames = new Set([...map1.keys(), ...map2.keys()]);

    allFileNames.forEach((fileName) => {
      const block1 = map1.get(fileName);
      const block2 = map2.get(fileName);

      if (block1 && block2) {
        // 如果两个块都存在，使用 diff 库来计算差异并合并代码
        const diff = Diff.diffLines(block1.code, block2.code);
        const mergedCode = diff
          .map((part) => {
            return part.value;
          })
          .join("");
        mergedBlocks.push({
          fileName,
          language: block1.language,
          code: mergedCode,
        });
      } else if (block1) {
        mergedBlocks.push(block1);
      } else if (block2) {
        mergedBlocks.push(block2);
      }
    });

    return mergedBlocks;
  }

  static mergeCodeBlocks(chatMessages: Message[]): CodeBlock[] {
    const aiMessages = chatMessages.filter((msg) =>
      msg.sender === 'bot' && Array.isArray(msg.codeBlocks) && msg.codeBlocks.length > 0
    );
    if (aiMessages.length === 0) return [];

    if (aiMessages.length === 1) {
      return aiMessages[0].codeBlocks || [];
    }

    const lastTwoMessages = aiMessages.slice(-2);
    const [lastMessage, secondLastMessage] = lastTwoMessages;

    return CodeBlocks.extractCodeBlocks(secondLastMessage.codeBlocks || [], lastMessage.codeBlocks || []);
  }
}
