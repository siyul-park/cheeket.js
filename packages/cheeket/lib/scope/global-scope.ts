import InternalTokens from '../internal-tokens';
import InternalEvents from '../internal-events';
import Factory from '../factory';
import AsyncLock from '../async/async-lock';
import AsyncEventEmitter from '../async/async-event-emitter';

interface GlobalScope<T> extends Factory<T> {
  clear(): void;
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
          eventEmitters.delete(eventEmitter);
          eventEmitter.removeListener(InternalEvents.Clear, handleClearContainer);
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

      eventEmitter.emit(InternalEvents.PreCreate, context);
      await eventEmitter.emitAsync(InternalEvents.PreCreateAsync, context);

      value = await delegator(context);

      eventEmitter.emit(InternalEvents.PostCreate, context);
      await eventEmitter.emitAsync(InternalEvents.PostCreateAsync, context);

      return value;
    });
  };

  Object.assign(factory, {
    clear(): void {
      eventEmitters.forEach((eventEmitter) => {
        eventEmitter.emit(InternalEvents.PreClear, value);
        eventEmitter.emit(InternalEvents.Clear, value);
        eventEmitter.emit(InternalEvents.PostClear, value);
      });

      value = undefined;
    },
  });

  return factory as GlobalScope<T>;
}

export { GlobalScope };
export default globalScope;
