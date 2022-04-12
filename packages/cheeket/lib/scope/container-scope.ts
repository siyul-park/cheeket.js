/* eslint-disable @typescript-eslint/no-shadow */

import InternalTokens from '../internal-tokens';
import InternalEvents from '../internal-events';
import Factory from '../factory';
import { AsyncEventEmitter, AsyncLock } from '../async';

interface ContainerScope<T> extends Factory<T> {
  get(eventEmitter: AsyncEventEmitter): T | undefined;
  delete(eventEmitter: AsyncEventEmitter): Promise<void>;

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

      await eventEmitter.emit(InternalEvents.PreCreate, context);

      const value = await delegator(context);
      values.set(eventEmitter, value);

      const handleClearContainer = async (cleared: unknown) => {
        if (cleared === eventEmitter) {
          eventEmitter.removeListener(InternalEvents.PreClear, handleClearContainer);

          await eventEmitter.emit(InternalEvents.PreClear, value);
          await eventEmitter.emit(InternalEvents.Clear, value);
          await eventEmitter.emit(InternalEvents.PostClear, value);
        }
      };
      const handleClearValue = (cleared: unknown) => {
        if (cleared === value) {
          eventEmitter.removeListener(InternalEvents.Clear, handleClearValue);

          values.delete(eventEmitter);
        }
      };

      eventEmitter.addListener(InternalEvents.PreClear, handleClearContainer);
      eventEmitter.addListener(InternalEvents.Clear, handleClearValue);

      await eventEmitter.emit(InternalEvents.PostCreate, context);

      return value;
    });
  };

  Object.assign(factory, {
    get(eventEmitter: AsyncEventEmitter): T | undefined {
      return values.get(eventEmitter);
    },
    delete: async (eventEmitter: AsyncEventEmitter) => {
      const value = values.get(eventEmitter);
      if (value !== undefined) {
        await eventEmitter.emit(InternalEvents.PreClear, value);
        await eventEmitter.emit(InternalEvents.Clear, value);
        await eventEmitter.emit(InternalEvents.PostClear, value);
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
