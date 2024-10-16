import { RouteSaveWorkspace } from "@/types/routeApi";
import JSONUtil from "@/utils/JSONUtil";
import { AsyncExecutor, ExecutorPlugin, ExecutorError } from "lib/executor";

// Define a plugin that logs success and errors
class LoggerPlugin<T = RouteSaveWorkspace["response"]> extends ExecutorPlugin<T> {
  onSuccess(result: T): T {
    console.log(`Task succeeded with result: ${JSONUtil.stringify(result)}`);

    return result;
  }

  onError(error: Error): ExecutorError {
    console.error(`Task failed: ${error.message}`);
    return new ExecutorError("Logged error", "LOG_ERROR", error);
  }
}

export class AiApiExecutor extends AsyncExecutor {
  constructor() {
    super();
    this.addPlugin(new LoggerPlugin());
  }
}
