import Queue from "./queue";

class AsyncLock {
  private readonly queues = new Map<unknown, Queue<() => Promise<unknown>>>();

  acquire<T>(key: unknown, process: () => Promise<T>): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const processes = this.queues.get(key) ?? new Queue();

      processes.enqueue(async () => {
        try {
          resolve(await process());
        } catch (e) {
          reject(e);
        } finally {
          this.exec(key);
        }
      });
      this.queues.set(key, processes);

      if (this.queues.size <= 1) {
        this.exec(key);
      }
    });
  }

  private exec(key: unknown) {
    const processes = this.queues.get(key) ?? new Queue();
    const process = processes.dequeue();
    if (process === undefined) {
      this.queues.delete(key);
      return;
    }
    process();
  }
}

export default AsyncLock;
