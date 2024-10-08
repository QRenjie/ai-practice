import fs from "fs";
import path from "path";

/**
 * 目录读取服务类
 */
export default class DirectoryReader {
  /**
   * @param {string} [baseDir="templates"] - 基础目录，默认为 templates 目录
   * @param {string[]} [excludeDirs=[]] - 排除的目录数组
   */
  constructor(baseDir = "templates", excludeDirs = []) {
    this.baseDir = baseDir;
    this.excludeDirs = excludeDirs;
  }

  /**
   * 读取指定目录的内容
   * @param {string} dir - 要读取的目录
   * @param {Object} options - 选项对象
   * @param {string[]} [options.excludeDirs] - 可选的排除目录数组
   * @param {boolean} [options.useRelativePath=true] - 是否使用相对路径，默认值为 true
   * @param {string} [originalDir] - 原始目录，用于路径处理
   * @returns {Record<string, string>} 读取的文件内容
   */
  readDirectory(
    dir = this.baseDir,
    options = { useRelativePath: true },
    originalDir = dir // 新增参数，跟踪原始目录
  ) {
    const { excludeDirs = this.excludeDirs, useRelativePath = true } = options;
    let result = {};

    const items = fs.readdirSync(dir);
    for (const item of items) {
      const itemPath = path.join(dir, item).replace(/\\/g, '/');
      const stat = fs.statSync(itemPath);

      // 检查是否是排除的目录
      if (excludeDirs.includes(item)) {
        continue;
      }

      if (stat.isDirectory()) {
        // 递归读取子目录
        result = {
          ...result,
          ...this.readDirectory(itemPath, options, originalDir),
        };
      } else {
        // 读取文件内容并添加到结果中
        const content = fs.readFileSync(itemPath, "utf-8");
        // 根据参数决定是否去掉第一次传入的目录
        const relativePath = useRelativePath
          ? path.relative(originalDir, itemPath).replace(/\\/g, '/') // 使用正斜杠替换反斜杠
          : itemPath;
        result[relativePath] = content;
      }
    }

    return result;
  }

  /**
   * 读取 React Tailwind 目录的内容
   * @param {Object} options - 选项对象
   * @param {boolean} [options.useRelativePath=true] - 是否使用相对路径，默认值为 true
   * @returns {Record<string, string>} 读取的文件内容
   */
  readReactTailwind(options = { useRelativePath: true }) {
    const reactTailwindDir = path.join(this.baseDir, "react-tailwindcss").replace(/\\/g, '/'); // 指定 React Tailwind 目录
    return this.readDirectory(
      reactTailwindDir,
      {
        excludeDirs: [
          ".DS_Store",
          ".gitignore",
          "node_modules",
          "dist",
          "build",
          "package-lock.json",
          "README.md",
          "yarn.lock",
        ],
        ...options,
      },
      reactTailwindDir // 传入原始目录
    );
  }
}
