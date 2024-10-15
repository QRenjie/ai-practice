import { join } from "path";
import JSONUtil from "./JSONUtil";
import { readFileSync, existsSync } from "fs";
import { ROOT_PATH } from "../../config/path.js";

const getWorkspacesJSON = () => {
  const filePath = join(ROOT_PATH, ".data/workspaces.json");
  if (!existsSync(filePath)) {
    return {};
  }
  return JSONUtil.parse(readFileSync(filePath, "utf8"));
};

const workspacesJSON = getWorkspacesJSON();

export default class DataGetter {
  /**
   * 获取工作区列表
   * @param {*} type 
   * @returns {import("@/types/workspace").WorkspaceState[]}
   */
  static getWorkspaces(type) {
    const workspaceList = Object.values(workspacesJSON);

    if (type === "all") {
      return workspaceList;
    }

    return workspaceList.filter((workspace) => {
      return type === "public"
        ? workspace.meta?.public
        : !workspace.meta?.public;
    });
  }

  /**
   * 根据ID获取特定工作区
   * @param {string} id 工作区ID
   * @returns {Promise<import("@/types/workspace").WorkspaceState | null>}
   */
  static async getWorkspaceById(id) {
    try {
      const workspace = workspacesJSON[id];
      return Promise.resolve(workspace || null);
    } catch (error) {
      console.error("获取工作区时出错:", error);
      return Promise.resolve(null);
    }
  }
}
