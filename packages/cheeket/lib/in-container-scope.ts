/* eslint-disable @typescript-eslint/no-shadow */

import Provider from "./provider";
import InternalTokens from "./internal-tokens";
import InternalEvents from "./internal-events";
import Factory from "./factory";
import BindStrategy from "./bind-strategy";
import AsyncLock from "./async-lock";
import AsyncEventEmitter from "./async-event-emitter";

interface InContainerScope<T> extends Provider<T> {
  get size(): number;
}

function inContainerScope<T, U = T>(
  factory: Factory<T, U>,
  bindStrategy: BindStrategy<T, U>
): InContainerScope<T> {
  const values = new Map<AsyncEventEmitter, U>();
  const lock = new AsyncLock();

  const provider: Provider<T> = async (context, next) => {
    const eventEmitter = await context.resolve(
      InternalTokens.AsyncEventEmitter
    );

    const founded = values.get(eventEmitter);
    if (founded !== undefined) {
      await bindStrategy(context, founded, next);
      return;
    }

    const created = await lock.acquire(eventEmitter, async () => {
      const founded = values.get(eventEmitter);
      if (founded !== undefined) {
        await bindStrategy(context, founded, next);
        return;
      }

      const value = await factory(context);
      values.set(eventEmitter, value);

      await bindStrategy(context, value, next);

      return value;
    });

    if (created !== undefined) {
      const clearListener = () => {
        eventEmitter.removeListener(InternalEvents.Clear, clearListener);
        values.delete(eventEmitter);
      };
      eventEmitter.addListener(InternalEvents.Clear, clearListener);

      eventEmitter.emit(InternalEvents.Create, created);
      await eventEmitter.emitAsync(InternalEvents.CreateAsync, created);
    }
  };

  return Object.defineProperty(provider, "size", {
    get(): number {
      return values.size;
    },
  }) as InContainerScope<T>;
}

export { InContainerScope };
export default inContainerScope;
