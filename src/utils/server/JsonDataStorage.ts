import fs from "fs/promises";
import path from "path";
import { log } from "../log";

export class JsonDataStorage {
  private dataDir: string;
  private fileName: string;
  private fileExt: string = ".json";

  constructor(fileName: string, dataDir?: string) {
    this.dataDir = dataDir || path.join(process.cwd(), ".data");
    this.fileName = `${fileName}${this.fileExt}`; // 文件名
    this.ensureDataDir(); // 确保目录存在
  }

  // 确保数据目录存在
  private async ensureDataDir(): Promise<void> {
    try {
      await fs.access(this.dataDir);
    } catch {
      await fs.mkdir(this.dataDir, { recursive: true });
    }
  }

  // 获取完整文件路径
  private getFilePath(): string {
    return path.join(this.dataDir, this.fileName);
  }

  // 从文件中读取所有数据（JSON 格式）
  async readAllData(): Promise<Record<string, string>> {
    try {
      const filePath = this.getFilePath();
      const data = await fs.readFile(filePath, "utf-8");
      return JSON.parse(data); // 将文件内容解析为对象
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        // 文件不存在时返回空对象
        return {};
      }
      throw error; // 其他错误抛出
    }
  }

  // 将数据写入文件（覆盖整个文件内容）
  private async writeAllData(data: Record<string, string>): Promise<void> {
    const filePath = this.getFilePath();
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  }

  // 保存数据（存入指定的键）
  async saveData(key: string, value: string): Promise<void> {
    const allData = await this.readAllData(); // 读取所有数据
    allData[key] = value; // 更新指定键的数据
    await this.writeAllData(allData); // 写入文件
    log.debug(`Data saved with key: ${key}`);
  }

  // 获取指定键的数据
  async getData(key: string): Promise<string | null> {
    const allData = await this.readAllData(); // 读取所有数据
    if (key in allData) {
      // console.log(`Retrieved data for key: ${key}`, allData[key]);
      return allData[key];
    }
    // console.log(`No data found for key: ${key}`);
    return null;
  }
}
