import crypto from "crypto";
import { Buffer } from "buffer";
import zlib from "zlib"; // 用于压缩和解压缩

// 配置加密算法与密钥（使用 AES-128-CBC）
const ALGORITHM = "aes-128-cbc";
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, "base64").slice(0, 16); // 16 字节密钥
const IV_LENGTH = 16; // IV 必须是 16 字节

type ValueType = string;

export class WorkspaceEncrypt {
  // 加密函数
  static encrypt(value: ValueType): string {
    const iv = crypto.randomBytes(IV_LENGTH); // 随机生成 IV
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

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
      ALGORITHM,
      KEY,
      Buffer.from(iv, "base64")
    );

    // 解密后再解压
    let decrypted = decipher.update(encrypted, "base64");
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    const decompressedValue = zlib.inflateSync(decrypted);

    return decompressedValue.toString();
  }
}
