import { RouteSaveWorkspace } from "@/types/routeApi";
import JSONUtil from "@/utils/JSONUtil";
import { log } from "@/utils/log";
import { AsyncExecutor, ExecutorPlugin, ExecutorError } from "lib/executor";

// Define a plugin that logs success and errors
class LoggerPlugin<T = RouteSaveWorkspace["response"]> extends ExecutorPlugin<T> {
  onSuccess(result: T): T {
    log.info(`Task succeeded with result: ${JSONUtil.stringify(result)}`);

    return result;
  }

  onError(error: Error): ExecutorError {
    log.error(`Task failed: ${error.message}`);
    return new ExecutorError("Logged error", "LOG_ERROR", error);
  }
}

export class AiApiExecutor extends AsyncExecutor {
  constructor() {
    super();
    this.addPlugin(new LoggerPlugin());
  }
}
