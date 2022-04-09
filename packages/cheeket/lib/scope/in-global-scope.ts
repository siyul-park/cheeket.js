import InternalTokens from '../internal-tokens';
import InternalEvents from '../internal-events';
import Factory from '../factory';
import AsyncLock from '../async-lock';
import Middleware from '../middleware';
import BindStrategy from '../bind-strategy';
import AsyncEventEmitter from '../async-event-emitter';

interface InGlobalScope<T> extends Middleware<T> {
  clear(): void;
}

const lock = new AsyncLock();

function inGlobalScope<T, U = T>(factory: Factory<T, U>, bindStrategy: BindStrategy<T, U>): InGlobalScope<T> {
  let value: U | undefined;
  const eventEmitters = new Set<AsyncEventEmitter>();

  const middleware: Middleware<T> = async (context, next) => {
    const eventEmitter = await context.resolve(InternalTokens.AsyncEventEmitter);
    if (!eventEmitters.has(eventEmitter)) {
      const handleClearContainer = (cleared: unknown) => {
        if (cleared === eventEmitter) {
          eventEmitters.delete(eventEmitter);
          eventEmitter.removeListener(InternalEvents.PreClear, handleClearContainer);
        }
      };
      eventEmitter.addListener(InternalEvents.PreClear, handleClearContainer);
      eventEmitters.add(eventEmitter);
    }

    if (value !== undefined) {
      await bindStrategy.bind(context, value);
      await bindStrategy.runNext(context, next);

      return;
    }

    await lock.acquire(factory, async () => {
      if (value !== undefined) {
        await bindStrategy.bind(context, value);
        return;
      }

      eventEmitter.emit(InternalEvents.PreCreate, context);
      await eventEmitter.emitAsync(InternalEvents.PreCreateAsync, context);

      value = await factory(context);
      await bindStrategy.bind(context, value);

      eventEmitter.emit(InternalEvents.PostCreate, context);
      await eventEmitter.emitAsync(InternalEvents.PostCreateAsync, context);
    });

    await bindStrategy.runNext(context, next);
  };

  Object.assign(middleware, {
    clear(): void {
      eventEmitters.forEach((eventEmitter) => {
        eventEmitter.emit(InternalEvents.PreClear, value);
      });
      eventEmitters.forEach((eventEmitter) => {
        eventEmitter.emit(InternalEvents.Clear, value);
      });
      eventEmitters.forEach((eventEmitter) => {
        eventEmitter.emit(InternalEvents.PostClear, value);
      });

      value = undefined;
    },
  });

  return middleware as InGlobalScope<T>;
}

export { InGlobalScope };
export default inGlobalScope;
