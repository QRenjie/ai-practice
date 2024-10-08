import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import DirectoryReader from "../src/utils/DirectoryReader.js";
import sandpackFile from "../config/sandpackFile.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
  // 读取默认配置
  const defaultConfig = JSON.parse(
    readFileSync(join(__dirname, "../config/workspace.default.json"), "utf8")
  );

  // 读取现有的workspace配置
  const workspaceConfigPath = join(__dirname, "../config/workspace.json");
  const workspaceConfig = JSON.parse(readFileSync(workspaceConfigPath, "utf8"));

  // 获取templates目录下的所有子目录
  const templatesDir = join(__dirname, "../templates");
  const templateDirs = readdirSync(templatesDir).filter((file) =>
    statSync(join(templatesDir, file)).isDirectory()
  );

  const directoryReader = new DirectoryReader(templatesDir);

  // 生成新的配置
  const newConfig = {};

  templateDirs.forEach((template) => {
    // 如果workspace中存在对应的key,使用它,否则使用默认配置
    newConfig[template] =
      workspaceConfig[template] || JSON.parse(JSON.stringify(defaultConfig));

    // 修改 config.coderPrompt
    newConfig[
      template
    ].config.coderPrompt = `${defaultConfig.config.coderPrompt}:${template}`;

    // 读取模板文件
    const templateDir = join(templatesDir, template);

    try {
      const templateFiles = directoryReader.readDirectory(
        templateDir,
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
          useRelativePath: true,
        },
        templateDir
      );

      // 将templateFiles转换为SandpackFile类型，并过滤掉package.json
      const sandpackFiles = Object.entries(templateFiles).reduce(
        (acc, [filePath, code]) => {
          if (filePath !== "package.json") {
            const updatedFilePath = filePath.startsWith("/")
              ? filePath
              : `/${filePath}`;
            acc[updatedFilePath] = sandpackFile(code);
          }
          return acc;
        },
        {}
      );

      // 更新code.files
      newConfig[template].code.files = sandpackFiles;

      // 从templateFiles中的package.json获取依赖信息和template
      if (templateFiles["package.json"]) {
        const packageJsonContent = JSON.parse(templateFiles["package.json"]);

        // 更新code.customSetup
        newConfig[template].code.customSetup = {
          dependencies: packageJsonContent.dependencies || {},
          devDependencies: packageJsonContent.devDependencies || {},
        };

        // 更新code.template
        if (
          packageJsonContent.config &&
          packageJsonContent.config.sandpack &&
          packageJsonContent.config.sandpack.template
        ) {
          newConfig[template].code.template =
            packageJsonContent.config.sandpack.template;
        }
      } else {
        newConfig[template].code.customSetup = {};
      }
    } catch (error) {
      console.error(`读取模板 ${template} 时发生错误:`, error);
    }
  });

  // 直接更新workspace.json文件
  writeFileSync(workspaceConfigPath, JSON.stringify(newConfig, null, 2));
  console.log("workspace.json 生成成功");
} catch (error) {
  console.error("workspace.json 生成失败:", error);
}
