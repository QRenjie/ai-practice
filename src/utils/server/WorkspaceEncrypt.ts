import crypto from "crypto";
import { Buffer } from "buffer";

// 配置加密算法与密钥
const ALGORITHM = "aes-256-cbc"; // 或者使用 'aes-128-cbc'
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, "base64"); // 32 字节密钥

type ValueType = string;
export class WorkspaceEncrypt {
  static encrypt(value: ValueType): string {
    const iv = crypto.randomBytes(16); // 初始向量（IV），需 16 字节
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
    let encrypted = cipher.update(value, "utf8", "base64");
    encrypted += cipher.final("base64");
    return `${encrypted}:${iv.toString("base64")}`; // 返回加密内容和 IV
  }

  static decrypt(encryptedData: string): ValueType {
    const [encrypted, iv] = encryptedData.split(":");
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      KEY,
      Buffer.from(iv, "base64")
    );
    let decrypted = decipher.update(encrypted, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
}
