import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import DirectoryReader from "../src/utils/DirectoryReader.js";
import sandpackFile from "../config/sandpackFile.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function updateWorkspaceConfig() {
  // 读取 React Tailwind 模板文件
  const directoryReader = new DirectoryReader();
  const reactTailwindFiles = directoryReader.readReactTailwind();

  // 读取现有的 workspace.json 文件
  const workspaceConfigPath = path.join(
    __dirname,
    "..",
    "config",
    "workspace.json"
  );
  const workspaceConfig = JSON.parse(
    fs.readFileSync(workspaceConfigPath, "utf-8")
  );

  // 将 reactTailwindFiles 转换为 SandpackFile 类型
  const sandpackFiles = Object.entries(reactTailwindFiles).reduce(
    (acc, [filePath, code]) => {
      acc[filePath] = sandpackFile(code);
      return acc;
    },
    {}
  );

  // 更新 defaultConfig.code.files
  workspaceConfig.defaultConfig.code.files = sandpackFiles;

  // 从 defaultConfig.code.files['package.json'] 中获取依赖信息
  const packageJsonContent = JSON.parse(sandpackFiles["package.json"].code);

  // 更新 defaultConfig.code.customSetup
  workspaceConfig.defaultConfig.code.customSetup = {
    dependencies: packageJsonContent.dependencies || {},
    devDependencies: packageJsonContent.devDependencies || {},
  };

  // 将更新后的配置写回文件
  fs.writeFileSync(
    workspaceConfigPath,
    JSON.stringify(workspaceConfig, null, 2)
  );
}
