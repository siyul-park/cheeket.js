/* eslint-disable @typescript-eslint/no-shadow */

import InternalTokens from '../internal-tokens';
import InternalEvents from '../internal-events';
import Factory from '../factory';
import AsyncLock from '../async/async-lock';
import AsyncEventEmitter from '../async/async-event-emitter';

interface ContainerScope<T> extends Factory<T> {
  get(eventEmitter: AsyncEventEmitter): T | undefined;
  delete(eventEmitter: AsyncEventEmitter): void;

  readonly size: number;
}

function containerScope<T>(delegator: Factory<T>): ContainerScope<T> {
  const values = new Map<AsyncEventEmitter, T>();
  const lock = new AsyncLock();

  const factory: Factory<T> = async (context) => {
    const eventEmitter = await context.resolve(InternalTokens.AsyncEventEmitter);

    const founded = values.get(eventEmitter);
    if (founded !== undefined) {
      return founded;
    }

    return lock.acquire(eventEmitter, async () => {
      const founded = values.get(eventEmitter);
      if (founded !== undefined) {
        return founded;
      }

      eventEmitter.emit(InternalEvents.PreCreate, context);
      await eventEmitter.emitAsync(InternalEvents.PreCreateAsync, context);

      const value = await delegator(context);
      values.set(eventEmitter, value);

      const handleClearContainer = (cleared: unknown) => {
        if (cleared === eventEmitter) {
          eventEmitter.emit(InternalEvents.PreClear, value);
          eventEmitter.emit(InternalEvents.Clear, value);
          eventEmitter.emit(InternalEvents.PostClear, value);

          eventEmitter.removeListener(InternalEvents.PreClear, handleClearContainer);
        }
      };
      const handleClearValue = (cleared: unknown) => {
        if (cleared === value) {
          values.delete(eventEmitter);

          eventEmitter.removeListener(InternalEvents.Clear, handleClearValue);
        }
      };

      eventEmitter.addListener(InternalEvents.PreClear, handleClearContainer);
      eventEmitter.addListener(InternalEvents.Clear, handleClearValue);

      eventEmitter.emit(InternalEvents.PostCreate, context);
      await eventEmitter.emitAsync(InternalEvents.PostCreateAsync, context);

      return value;
    });
  };

  Object.assign(factory, {
    get(eventEmitter: AsyncEventEmitter): T | undefined {
      return values.get(eventEmitter);
    },
    delete(eventEmitter: AsyncEventEmitter): void {
      const value = values.get(eventEmitter);
      if (value !== undefined) {
        eventEmitter.emit(InternalEvents.PreClear, value);
        eventEmitter.emit(InternalEvents.Clear, value);
        eventEmitter.emit(InternalEvents.PostClear, value);
      }
    },
  });

  return Object.defineProperty(factory, 'size', {
    get(): number {
      return values.size;
    },
  }) as ContainerScope<T>;
}

export { ContainerScope };
export default containerScope;
