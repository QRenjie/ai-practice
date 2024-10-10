import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 导出ideaflow根目录绝对路径
export const ROOT_PATH = resolve(__dirname, "../");
