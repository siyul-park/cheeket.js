import InternalTokens from '../internal-tokens';
import InternalEvents from '../internal-events';
import Factory from '../factory';
import AsyncLock from '../async/async-lock';
import AsyncEventEmitter from '../async/async-event-emitter';

interface GlobalScope<T> extends Factory<T> {
  clear(): Promise<void>;
}

const lock = new AsyncLock();

function globalScope<T>(delegator: Factory<T>): GlobalScope<T> {
  let value: T | undefined;
  const eventEmitters = new Set<AsyncEventEmitter>();

  const factory: Factory<T> = async (context) => {
    const eventEmitter = await context.resolve(InternalTokens.AsyncEventEmitter);
    if (!eventEmitters.has(eventEmitter)) {
      const handleClearContainer = (cleared: unknown) => {
        if (cleared === eventEmitter) {
          eventEmitter.removeListener(InternalEvents.Clear, handleClearContainer);
          eventEmitters.delete(eventEmitter);
        }
      };
      eventEmitter.addListener(InternalEvents.Clear, handleClearContainer);
      eventEmitters.add(eventEmitter);
    }

    if (value !== undefined) {
      return value;
    }

    return lock.acquire(delegator, async () => {
      if (value !== undefined) {
        return value;
      }

      await eventEmitter.emit(InternalEvents.PreCreate, context);
      value = await delegator(context);
      await eventEmitter.emit(InternalEvents.PostCreate, context);

      return value;
    });
  };

  Object.assign(factory, {
    clear: async () => {
      for await (const eventEmitter of eventEmitters) {
        await eventEmitter.emit(InternalEvents.PreClear, value);
        await eventEmitter.emit(InternalEvents.Clear, value);
        await eventEmitter.emit(InternalEvents.PostClear, value);
      }

      value = undefined;
    },
  });

  return factory as GlobalScope<T>;
}

export { GlobalScope };
export default globalScope;
