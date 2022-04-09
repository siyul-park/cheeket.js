/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/ban-types */

class AsyncEventEmitter {
  readonly #listeners = new Map<string | symbol, Function[]>();

  readonly #rawListeners = new Map<string | symbol, Function[]>();

  addListener(event: string | symbol, listener: (...args: any[]) => void | Promise<void>): this {
    return this.on(event, listener);
  }

  on(event: string | symbol, listener: (...args: any[]) => void | Promise<void>): this {
    const listeners = this.#listeners.get(event) ?? [];
    const rawListeners = this.#rawListeners.get(event) ?? [];

    listeners.push(listener);
    rawListeners.push(listener);

    this.#listeners.set(event, listeners);
    this.#rawListeners.set(event, rawListeners);
    return this;
  }

  once(event: string | symbol, listener: (...args: any[]) => void | Promise<void>): this {
    const wrapper = (...args: any[]) => {
      this.off(event, listener);
      return listener(...args);
    };

    const listeners = this.#listeners.get(event) ?? [];
    const rawListeners = this.#rawListeners.get(event) ?? [];

    listeners.push(listener);
    rawListeners.push(wrapper);

    this.#listeners.set(event, listeners);
    this.#rawListeners.set(event, rawListeners);
    return this;
  }

  removeListener(event: string | symbol, listener: (...args: any[]) => void | Promise<void>): this {
    return this.off(event, listener);
  }

  off(event: string | symbol, listener: (...args: any[]) => void | Promise<void>): this {
    const listeners = this.#listeners.get(event);
    const rawListeners = this.#rawListeners.get(event);
    if (listeners == null || rawListeners == null) {
      return this;
    }

    const index = listeners.indexOf(listener);
    if (index !== -1) {
      listeners.splice(index, 1);
      rawListeners.splice(index, 1);
    }

    this.#listeners.set(event, listeners);
    this.#rawListeners.set(event, rawListeners);

    return this;
  }

  removeAllListeners(event?: string | symbol): this {
    if (event == null) {
      this.#listeners.clear();
      this.#rawListeners.clear();
    } else  {
      this.#listeners.delete(event);
      this.#rawListeners.delete(event);
    }

    return this;
  }

  listeners(event: string | symbol): Function[] {
    return this.#listeners.get(event) ?? [];
  }

  rawListeners(event: string | symbol): Function[] {
    return this.#rawListeners.get(event) ?? [];
  }

  async emit(event: string | symbol, ...args: any[]): Promise<boolean> {
    const listeners = this.#rawListeners.get(event);
    if (listeners == null) {
      return false;
    }

    for await (const listener of [...listeners]) {
      await listener(...args);
    }

    return true;
  }

  listenerCount(event: string | symbol): number {
    const listeners = this.#listeners.get(event);
    if (listeners == null) {
      return 0;
    }

    return listeners.length;
  }

  prependListener(event: string | symbol, listener: (...args: any[]) => void | Promise<void>): this {
    const listeners = this.#listeners.get(event) ?? [];
    const rawListeners = this.#rawListeners.get(event) ?? [];

    listeners.unshift(listener);
    rawListeners.unshift(listener);

    this.#listeners.set(event, listeners);
    this.#rawListeners.set(event, rawListeners);
    return this;
  }

  prependOnceListener(event: string | symbol, listener: (...args: any[]) => void | Promise<void>): this {
    const wrapper = (...args: any[]) => {
      this.off(event, listener);
      return listener(...args);
    };

    const listeners = this.#listeners.get(event) ?? [];
    const rawListeners = this.#listeners.get(event) ?? [];

    listeners.unshift(listener);
    rawListeners.unshift(wrapper);

    this.#listeners.set(event, listeners);
    this.#rawListeners.set(event, rawListeners);
    return this;
  }

  eventNames(): Array<string | symbol> {
    return Array.from(this.#listeners.keys());
  }
}

export default AsyncEventEmitter;
