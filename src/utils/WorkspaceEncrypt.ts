import { WorkspaceState } from "@/types/workspace";

const SECRET_KEY = "your_secret_key_here"; // 请替换为您的密钥

export class WorkspaceEncrypt {
  static encrypt(data: WorkspaceState): string {
    const jsonString = JSON.stringify(data);
    const encodedData = Buffer.from(jsonString).toString("base64");
    return this.xorEncrypt(encodedData, SECRET_KEY);
  }

  static decrypt(encryptedData: string): WorkspaceState {
    const decodedData = this.xorEncrypt(encryptedData, SECRET_KEY);
    const jsonString = Buffer.from(decodedData, "base64").toString();
    return JSON.parse(jsonString) as WorkspaceState;
  }

  private static xorEncrypt(input: string, key: string): string {
    let output = "";
    for (let i = 0; i < input.length; i++) {
      const charCode = input.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      output += String.fromCharCode(charCode);
    }
    return output;
  }
}
