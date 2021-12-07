/* eslint-disable @typescript-eslint/no-shadow */

import InternalTokens from "../internal-tokens";
import InternalEvents from "../internal-events";
import Factory from "../factory";
import AsyncLock from "../async-lock";
import AsyncEventEmitter from "../async-event-emitter";
import Middleware from "../middleware";
import BindStrategy from "../bind-strategy";

interface InContainerScope<T, U> extends Middleware<T> {
  get(eventEmitter: AsyncEventEmitter): U | undefined;
  delete(eventEmitter: AsyncEventEmitter): void;

  readonly size: number;
}

function inContainerScope<T, U = T>(factory: Factory<T, U>, bindStrategy: BindStrategy<T, U>): InContainerScope<T, U> {
  const values = new Map<AsyncEventEmitter, U>();
  const lock = new AsyncLock();

  const middleware: Middleware<T> = async (context, next) => {
    const eventEmitter = await context.resolve(InternalTokens.AsyncEventEmitter);

    const founded = values.get(eventEmitter);
    if (founded !== undefined) {
      await bindStrategy.bind(context, founded);
      await bindStrategy.runNext(context, next);

      return;
    }

    await lock.acquire(eventEmitter, async () => {
      const founded = values.get(eventEmitter);
      if (founded !== undefined) {
        await bindStrategy.bind(context, founded);
        return;
      }

      eventEmitter.emit(InternalEvents.PreCreate, context);
      await eventEmitter.emitAsync(InternalEvents.PreCreateAsync, context);

      const value = await factory(context);
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

      await bindStrategy.bind(context, value);

      eventEmitter.emit(InternalEvents.PostCreate, context);
      await eventEmitter.emitAsync(InternalEvents.PostCreateAsync, context);
    });

    await bindStrategy.runNext(context, next);
  };

  Object.assign(middleware, {
    get(eventEmitter: AsyncEventEmitter): U | undefined {
      return values.get(eventEmitter);
    },
    delete(eventEmitter: AsyncEventEmitter): void {
      const value = values.get(eventEmitter);
      if (value !== undefined) {
        eventEmitter.emit(InternalEvents.PreClear, value);
        values.delete(eventEmitter);
        eventEmitter.emit(InternalEvents.PostClear, value);
      }
    },
  });

  return Object.defineProperty(middleware, "size", {
    get(): number {
      return values.size;
    },
  }) as InContainerScope<T, U>;
}

export { InContainerScope };
export default inContainerScope;
