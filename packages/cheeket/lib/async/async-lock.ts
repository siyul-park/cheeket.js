import Queue from '../queue';

class AsyncLock {
  private readonly queues = new Map<unknown, Queue<() => Promise<unknown>>>();

  acquire<T>(key: unknown, process: () => Promise<T>): Promise<T> {
    const jobs = this.queues.get(key) ?? new Queue();
    this.queues.set(key, jobs);

    return new Promise<T>((resolve, reject) => {
      const job = async () => {
        try {
          resolve(await process());
        } catch (e) {
          reject(e);
        } finally {
          jobs.dequeue(job);
          if (jobs.size === 0) {
            this.queues.delete(key);
          } else {
            this.exec(key);
          }
        }
      };

      jobs.enqueue(job);

      if (jobs.size <= 1) {
        this.exec(key);
      }
    });
  }

  private exec(key: unknown) {
    const jobs = this.queues.get(key);
    const job = jobs?.first();
    if (job === undefined) {
      return;
    }
    job();
  }
}

export default AsyncLock;
