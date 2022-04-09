import EventEmitter from 'events';

class AsyncEventEmitter extends EventEmitter {
  constructor() {
    super({ captureRejections: true });
  }

  emitAsync(event: string | symbol, ...args: unknown[]): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        const count = this.listenerCount(event);
        if (count === 0) {
          resolve(false);
          return;
        }

        let current = 0;
        this.emit(event, ...args, () => {
          current += 1;
          if (current >= count) {
            resolve(true);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}

export default AsyncEventEmitter;
