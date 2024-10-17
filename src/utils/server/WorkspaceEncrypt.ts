import crypto from "crypto";
import { Buffer } from "buffer";

// 配置加密算法与密钥
const ALGORITHM = "aes-256-cbc"; // 或者使用 'aes-128-cbc'
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, "base64"); // 32 字节密钥
const IV = crypto.randomBytes(16); // 初始向量（IV），需 16 字节

type ValueType = string;
export class WorkspaceEncrypt {
  static encrypt(value: ValueType): { iv: string; data: string } {
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, IV);
    let encrypted = cipher.update(value, "utf8", "base64");
    encrypted += cipher.final("base64");
    return {
      iv: IV.toString("base64"), // 保存 IV
      data: encrypted, // 保存加密后的数据
    };
  }

  static decrypt(encryptedData: { iv: string; data: string }): ValueType {
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      KEY,
      Buffer.from(encryptedData.iv, "base64")
    );
    let decrypted = decipher.update(encryptedData.data, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
}
