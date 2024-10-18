import { WorkspaceState } from "@/types/workspace";
import { JsonDataStorage } from "./JsonDataStorage";
import JSONUtil from "../JSONUtil";
import { WorkspaceEncrypt } from "./WorkspaceEncrypt";
import { Uid } from "../Uid";

export class WorkspaceSaveManager {
  dataStorage: JsonDataStorage = new JsonDataStorage("workspace-save");

  set(key: string, workspace: WorkspaceState) {
    return this.dataStorage.saveData(key, JSONUtil.stringify(workspace));
  }

  async get(key: string): Promise<WorkspaceState | null> {
    const workspace = await this.dataStorage.getData(key);

    if (!workspace) {
      return null;
    }

    return JSONUtil.parse(workspace);
  }

  /**
   * 获取工作区列表
   * @param {*} type
   * @returns {import("@/types/workspace").WorkspaceState[]}
   */
  async getWorkspaces(type: string): Promise<WorkspaceState[]> {
    const workspaceList: string[] = Object.values(
      await this.dataStorage.readAllData()
    );

    if (type === "all") {
      return workspaceList.map((workspaceString) => {
        return JSONUtil.parse(workspaceString) as WorkspaceState;
      });
    }

    return workspaceList
      .filter((workspaceString) => {
        if (type === "public") {
          return workspaceString.includes('"public":true');
        }

        if (type === "my") {
          return workspaceString.includes('"public":false');
        }
        return false;
      })
      .map((workspaceString) => {
        return JSONUtil.parse(workspaceString) as WorkspaceState;
      });
  }

  /**
   * 根据ID获取特定工作区
   * @param {string} id 工作区ID
   * @returns {Promise<import("@/types/workspace").WorkspaceState | null>}
   */
  async getWorkspaceById(id: string): Promise<WorkspaceState | null> {
    return this.get(id);
  }
}

export class WorkspacePublishManager {
  dataStorage: JsonDataStorage = new JsonDataStorage("workspace-publish");

  async set(workspace: WorkspaceState) {
    // 加密 workspaceState
    const workspaceToken = WorkspaceEncrypt.encrypt(workspace);
    const token = Uid.generate();

    await this.dataStorage.saveData(token, JSONUtil.stringify(workspaceToken));

    return { workspaceToken, token };
  }

  async get(token: string): Promise<WorkspaceState | null> {
    const workspaceToken = await this.dataStorage.getData(token);

    if (!workspaceToken) {
      return null;
    }

    return WorkspaceEncrypt.decrypt(workspaceToken);
  }
}
