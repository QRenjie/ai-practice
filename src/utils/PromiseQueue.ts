type Task<T> = () => Promise<T>;

export default class PromiseQueue {
  private queue: Task<unknown>[] = [];
  private isProcessing = false;

  add<T>(task: Task<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(() => task().then(resolve).catch(reject));
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    while (this.queue.length > 0) {
      const currentTask = this.queue.shift();
      if (currentTask) {
        try {
          await currentTask();
        } catch (error) {
          console.error("任务执行出错:", error);
        }
      }
    }

    this.isProcessing = false;
  }
}
