import AIApiScheduler from "@/services/AIApiScheduler";
import { CodeBlock } from "@/types/apiTypes";

export default class CodeRender {
  static vaildFileTypes = ["html", "python", "jsx", "tsx"];
  private aIApiScheduler: AIApiScheduler;

  constructor() {
    this.aIApiScheduler = new AIApiScheduler();
  }

  isTsx(block?: CodeBlock): boolean {
    return block?.language === "tsx" || block?.language === "jsx";
  }

  render(blocks: CodeBlock[]): Promise<CodeBlock> {
    // 获取第一个有效的代码块
    const codeBlock = blocks.filter((block) =>
      CodeRender.vaildFileTypes.includes(block.language)
    )?.[0];
    console.log("codeBlock", codeBlock);

    if (!codeBlock) {
      return Promise.reject("No valid code block found");
    }

    if (this.isTsx(codeBlock)) {
      // 将tsx组件代码，转换为jsx组件代码
      return this.aIApiScheduler.renderTSX(codeBlock).then(({ content }) => {
        return {
          ...codeBlock,
          code: content,
        };
      });
    } else if (codeBlock.language === "python") {
      return this.aIApiScheduler
        .execPythonCode(codeBlock)
        .then(({ result }) => {
          return {
            ...codeBlock,
            code: result,
          };
        });
    } else {
      // HTML 内容直接设置
      return Promise.resolve(codeBlock);
    }
  }
}

const codeRender = new CodeRender();
export { codeRender };
