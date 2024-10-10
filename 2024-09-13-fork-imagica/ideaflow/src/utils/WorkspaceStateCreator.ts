import { WorkspaceType, WorkspaceState } from "@/types/workspace";
import { merge } from "lodash-es";
import { v4 as uuidv4 } from "uuid";
import workspaceConfig from "../../config/workspace.json"; // 新增这一行
import { DeepPartial } from "@/types/common";


const workspaceKeys = Object.keys(workspaceConfig);

export const workspaceOptions = workspaceKeys.map((key) => ({
  label: key,
  value: key,
}));

export class WorkspaceStateCreator {
  defaultKey: WorkspaceType = "static-html";

  createSelector(source?: DeepPartial<WorkspaceState>) {
    // 创建一个静态的html工作区, 为了控制选择 template
    const defaults = this.create("static-html", source);
    // defaults.code.files = {};
    defaults.code.customSetup = {};
    defaults.code.template = undefined;
    return defaults;
  }

  defaults(source?: DeepPartial<WorkspaceState>) {
    return this.create(this.defaultKey, source);
  }

  create(
    key: WorkspaceType = this.defaultKey,
    source?: DeepPartial<WorkspaceState>
  ): WorkspaceState {
    const config = workspaceConfig[key] as WorkspaceState | undefined;
    if (!config) {
      throw new Error(`Workspace config not found for key: ${key}`);
    }

    return merge({}, config, source, {
      id: source?.id || uuidv4(),
    });
  }


  /**
   * 判断是否是模板
   * @param key 
   * @returns 
   */
  isTemplate(key: string): key is WorkspaceType {
    return workspaceKeys.includes(key);
  }
}

export const workspaceStateCreator = new WorkspaceStateCreator();
