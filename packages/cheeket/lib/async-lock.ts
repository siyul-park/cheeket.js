import Queue from "./queue";

class AsyncLock {
  private readonly queues = new Map<unknown, Queue<() => Promise<unknown>>>();

  acquire<T>(key: unknown, process: () => Promise<T>): Promise<T> {
    const processes = this.queues.get(key) ?? new Queue();
    this.queues.set(key, processes);

    return new Promise<T>((resolve, reject) => {
      const job = async () => {
        try {
          resolve(await process());
        } catch (e) {
          reject(e);
        } finally {
          processes.dequeue();
          this.exec(key);
        }
      };

      processes.enqueue(job);

      if (processes.size <= 1) {
        this.exec(key);
      }
    });
  }

  private exec(key: unknown) {
    const processes = this.queues.get(key);
    const process = processes?.first();
    if (process === undefined) {
      return;
    }
    process();
  }
}

export default AsyncLock;
