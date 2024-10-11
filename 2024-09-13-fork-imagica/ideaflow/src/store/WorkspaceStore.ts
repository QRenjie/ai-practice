import { DeepPartial } from "@/types/common";
import { WorkspaceState } from "@/types/workspace";
import { WorkspaceStateCreator } from "@/utils/WorkspaceStateCreator";
import { SliceStore } from "@qlover/slice-store-react";
import { merge } from "lodash-es";

export class WorkspaceStore extends SliceStore<WorkspaceState> {
  constructor(workspaceStateCreator: WorkspaceStateCreator) {
    super(() => workspaceStateCreator.defaults());
  }

  /**
   * 修改state
   * @param source
   */
  merge(source: DeepPartial<WorkspaceState>) {
    this.emit(merge({}, this.state, source));
  }

  setState(
    state: WorkspaceState | ((prevState: WorkspaceState) => WorkspaceState)
  ) {
    if (typeof state === "function") {
      this.emit(state(this.state));
    } else {
      this.emit(state);
    }
  }
}
