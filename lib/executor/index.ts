type PromiseTask<T> = () => Promise<T>;

// BasePlugin remains the same
export abstract class ExecutorPlugin<T = unknown, R = T> {
  onError?(error: Error): ExecutorError | void;
  onSuccess?(result: T): R | Promise<R>;
}

// Custom Error Class
export class ExecutorError extends Error {
  constructor(
    public message: string,
    public code: string,
    public originalError?: Error
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype); // Ensure instanceof works
  }
}

export interface ExecutorConfig {
  throwError?: boolean; // 是否抛出错误
  retry?: number; // 重试次数
}

// Simplified BaseExecutor with no generics
export abstract class Executor {
  protected plugins: ExecutorPlugin[] = [];

  constructor(protected config: ExecutorConfig = { throwError: true }) {}

  addPlugin(plugin: ExecutorPlugin) {
    this.plugins.push(plugin);
  }

  /**
   * 执行任务，并返回结果
   * @throw {ExecutorError} 如果任务执行失败，则抛出 ExecutorError
   * @param task 任务
   */
  abstract exec<T>(task: PromiseTask<T> | (() => T)): Promise<T> | T;

  /**
   * 执行任务，不抛出错误, 将所有错误包装为 ExecutorError
   * @param task 任务
   */
  abstract execNoError<T>(
    task: PromiseTask<T> | (() => T)
  ): Promise<T | ExecutorError> | T | ExecutorError;

  /**
   * 成功链
   * @param result
   */
  protected abstract successChain<T, R>(result: T): R | Promise<R>;

  /**
   * 错误链
   * @param error
   */
  protected abstract errorChain(
    error: Error
  ): ExecutorError | Promise<ExecutorError>;
}

/**
 * 异步执行器
 */
export class AsyncExecutor extends Executor {
  async execNoError<T>(task: PromiseTask<T>): Promise<T | ExecutorError> {
    try {
      return await this.exec(task);
    } catch (error) {
      return error as ExecutorError;
    }
  }

  async exec<T>(task: PromiseTask<T>): Promise<T> {
    try {
      const result = await task();
      return this.successChain<T, T>(result);
    } catch (error) {
      throw await this.errorChain(error as Error);
    }
  }

  protected async successChain<T, R>(result: T): Promise<R> {
    let modifiedResult: unknown = result;
    for (const plugin of this.plugins) {
      const pluginResult = await plugin.onSuccess?.(modifiedResult as T);

      // 提前返回
      if (pluginResult !== undefined) {
        return (modifiedResult = pluginResult) as R;
      }
    }
    return modifiedResult as R;
  }

  protected async errorChain(error: Error): Promise<ExecutorError> {
    for (const plugin of this.plugins) {
      const handledError = await plugin.onError?.(error);
      if (handledError) return handledError;
    }
    return new ExecutorError(
      "Unhandled async error",
      "UNKNOWN_ASYNC_ERROR",
      error
    );
  }
}

/**
 * 同步执行器
 */
export class SyncExecutor extends Executor {
  execNoError<T>(task: () => T): T | ExecutorError {
    try {
      return this.exec(task);
    } catch (error) {
      return error as ExecutorError;
    }
  }

  exec<T>(task: () => T): T {
    try {
      const result = task();
      return this.successChain<T, T>(result);
    } catch (error) {
      throw this.errorChain(error as Error);
    }
  }

  protected successChain<T, R>(result: T): R {
    let modifiedResult: unknown = result;
    for (const plugin of this.plugins) {
      const pluginResult = plugin.onSuccess?.(modifiedResult as T);

      // 提前返回
      if (pluginResult !== undefined) {
        return (modifiedResult = pluginResult) as R;
      }
    }
    return modifiedResult as R;
  }

  protected errorChain(error: Error): ExecutorError {
    for (const plugin of this.plugins) {
      const handledError = plugin.onError?.(error);
      if (handledError) return handledError;
    }
    return new ExecutorError(
      "Unhandled sync error",
      "UNKNOWN_SYNC_ERROR",
      error
    );
  }
}
