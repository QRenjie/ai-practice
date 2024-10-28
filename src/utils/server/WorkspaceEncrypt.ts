import { StringEntrypt, StringZlibEncrypt } from "@qlover/fe-utils/server";
import { WorkspaceState } from "@/types/workspace";
import JSONUtil from "../JSONUtil";

const stringEntrypt = new StringEntrypt(process.env.ENCRYPTION_KEY!);
const stringZlibEncrypt = new StringZlibEncrypt(process.env.ENCRYPTION_KEY!);

export class WorkspaceEncrypt {
  static encrypt(value: WorkspaceState, zlib: boolean = false): string {
    if (zlib) {
      return stringZlibEncrypt.encrypt(JSONUtil.stringify(value));
    }
    return stringEntrypt.encrypt(JSONUtil.stringify(value));
  }

  static decrypt(encryptedData: string, zlib: boolean = false): WorkspaceState {
    if (zlib) {
      return JSONUtil.parse(stringZlibEncrypt.decrypt(encryptedData));
    }
    return JSONUtil.parse(stringEntrypt.decrypt(encryptedData));
  }
}
