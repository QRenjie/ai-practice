import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join } from "path";
import DirectoryReader from "../src/utils/DirectoryReader.js";
import sandpackFile from "../config/sandpackFile.js";
import JSONUtil from "../src/utils/JSONUtil.js";
import { ROOT_PATH } from "../config/path.js";
// 新增: 读取templates.json
const templatesJSON = JSONUtil.parse(
  readFileSync(join(ROOT_PATH, "config/templates.json"), "utf8")
);

// 修改: 使用templatesJSON中的配置
const excludeDirs = templatesJSON.generateExcludeDirs;
const hiddenFiles = templatesJSON.hiddenFiles;

try {
  // 读取默认配置
  const defaultConfig = JSONUtil.parse(
    readFileSync(join(ROOT_PATH, "config/workspace.default.json"), "utf8")
  );

  // 读取现有的workspace配置
  const workspaceConfigPath = join(ROOT_PATH, "config/workspace.json");
  const workspaceConfig = JSONUtil.parse(
    readFileSync(workspaceConfigPath, "utf8")
  );

  // 获取templates目录下的所有子目录
  const templatesDir = join(ROOT_PATH, "templates");
  const templateDirs = readdirSync(templatesDir).filter((file) =>
    statSync(join(templatesDir, file)).isDirectory()
  );

  const directoryReader = new DirectoryReader(templatesDir, excludeDirs);

  // 生成新的配置
  const newConfig = {};

  templateDirs.forEach((template) => {
    // 如果workspace中存在对应的key,使用它,否则使用默认配置
    newConfig[template] =
      workspaceConfig[template] ||
      JSONUtil.parse(JSONUtil.stringify(defaultConfig));

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
          useRelativePath: true,
        },
        templateDir
      );

      // 将templateFiles转换为SandpackFile类型
      const sandpackFiles = Object.entries(templateFiles).reduce(
        (acc, [filePath, code]) => {
          const updatedFilePath = filePath.startsWith("/")
            ? filePath
            : `/${filePath}`;
          acc[updatedFilePath] = sandpackFile(code);

          // 如果filePath在hiddenFiles中, 则将hidden设置为true
          if (hiddenFiles.includes(filePath)) {
            acc[updatedFilePath].hidden = true;
          }

          return acc;
        },
        {}
      );

      // 更新code.files
      newConfig[template].code.files = sandpackFiles;

      // 从templateFiles中的package.json获取依赖信息和template
      if (templateFiles["package.json"]) {
        const packageJsonContent = JSONUtil.parse(
          templateFiles["package.json"]
        );

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
  writeFileSync(workspaceConfigPath, JSONUtil.stringify(newConfig, null, 2));
  console.log("workspace.json 生成成功");
} catch (error) {
  console.error("workspace.json 生成失败:", error);
}
