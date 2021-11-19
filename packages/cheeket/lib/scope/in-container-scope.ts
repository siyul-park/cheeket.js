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

  get size(): number;
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

      const value = await factory(context);
      values.set(eventEmitter, value);

      const clearListener = () => {
        eventEmitter.removeListener(InternalEvents.Clear, clearListener);
        values.delete(eventEmitter);
      };
      eventEmitter.addListener(InternalEvents.Clear, clearListener);

      await bindStrategy.bind(context, value);

      eventEmitter.emit(InternalEvents.Create, context);
      await eventEmitter.emitAsync(InternalEvents.CreateAsync, context);
    });

    await bindStrategy.runNext(context, next);
  };

  Object.assign(middleware, {
    get(eventEmitter: AsyncEventEmitter): U | undefined {
      return values.get(eventEmitter);
    },
    delete(eventEmitter: AsyncEventEmitter): void {
      values.delete(eventEmitter);
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
