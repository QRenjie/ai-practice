import crypto from "crypto";
import { Buffer } from "buffer";
import zlib from "zlib"; // 用于压缩和解压缩

type ValueType = string;

export class WorkspaceEncrypt {
  // 配置加密算法与密钥（使用 AES-128-CBC）
  static ALGORITHM = "aes-128-cbc";
  static KEY = Buffer.from(process.env.ENCRYPTION_KEY!, "base64").slice(0, 16); // 16 字节密钥
  static IV_LENGTH = 16; // IV 必须是 16 字节
  // 加密函数
  static encrypt(value: ValueType): string {
    const iv = crypto.randomBytes(WorkspaceEncrypt.IV_LENGTH); // 随机生成 IV
    const cipher = crypto.createCipheriv(
      WorkspaceEncrypt.ALGORITHM,
      WorkspaceEncrypt.KEY,
      iv
    );

    // 先压缩再加密
    const compressedValue = zlib.deflateSync(value);
    let encrypted = cipher.update(compressedValue, undefined, "base64");
    encrypted += cipher.final("base64");

    // 返回格式：密文:IV
    return `${encrypted}:${iv.toString("base64")}`;
  }

  // 解密函数
  static decrypt(encryptedData: string): ValueType {
    const [encrypted, iv] = encryptedData.split(":");
    const decipher = crypto.createDecipheriv(
      WorkspaceEncrypt.ALGORITHM,
      WorkspaceEncrypt.KEY,
      Buffer.from(iv, "base64")
    );

    // 解密后再解压
    let decrypted = decipher.update(encrypted, "base64");
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    const decompressedValue = zlib.inflateSync(decrypted);

    return decompressedValue.toString();
  }
}

/**
 * 数据长度定义加密长度
 */
export class WorkspaceEncryptLogger {
  // 配置加密算法与密钥
  static ALGORITHM = "aes-256-cbc"; // 或者使用 'aes-128-cbc'
  static KEY = Buffer.from(process.env.ENCRYPTION_KEY!, "base64"); // 32 字节密钥

  static encrypt(value: ValueType): string {
    const iv = crypto.randomBytes(16); // 初始向量（IV），需 16 字节
    const cipher = crypto.createCipheriv(
      WorkspaceEncryptLogger.ALGORITHM,
      WorkspaceEncryptLogger.KEY,
      iv
    );
    let encrypted = cipher.update(value, "utf8", "base64");
    encrypted += cipher.final("base64");
    return `${encrypted}:${iv.toString("base64")}`; // 返回加密内容和 IV
  }

  static decrypt(encryptedData: string): ValueType {
    const [encrypted, iv] = encryptedData.split(":");
    const decipher = crypto.createDecipheriv(
      WorkspaceEncryptLogger.ALGORITHM,
      WorkspaceEncryptLogger.KEY,
      Buffer.from(iv, "base64")
    );
    let decrypted = decipher.update(encrypted, "base64", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
}
