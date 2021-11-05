/* eslint-disable @typescript-eslint/no-shadow */

import Middleware from "./middleware";
import InternalTokens from "./internal-tokens";
import InternalEvents from "./internal-events";
import Factory from "./factory";
import BindStrategy from "./bind-strategy";
import AsyncLock from "./async-lock";
import AsyncEventEmitter from "./async-event-emitter";

interface InContainerScope<T> extends Middleware<T> {
  get size(): number;
}

function inContainerScope<T, U = T>(factory: Factory<T, U>, bindStrategy: BindStrategy<T, U>): InContainerScope<T> {
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

      eventEmitter.emit(InternalEvents.Create, value);
      await eventEmitter.emitAsync(InternalEvents.CreateAsync, value);
    });

    await bindStrategy.runNext(context, next);
  };

  return Object.defineProperty(middleware, "size", {
    get(): number {
      return values.size;
    },
  }) as InContainerScope<T>;
}

export { InContainerScope };
export default inContainerScope;
