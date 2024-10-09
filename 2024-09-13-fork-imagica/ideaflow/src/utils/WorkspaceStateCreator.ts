import { WorkspaceState, WorkspaceType } from "@/context/WorkspaceContext";
import { merge } from "lodash-es";
import workspaceConfig from "../../config/workspace.json"; // 新增这一行
import { v4 as uuidv4 } from "uuid";
import { DeepPartial } from "@/types/common";


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
}

export const workspaceStateCreator = new WorkspaceStateCreator();
