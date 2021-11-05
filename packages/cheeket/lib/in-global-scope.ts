import Provider from "./provider";
import InternalTokens from "./internal-tokens";
import InternalEvents from "./internal-events";
import Factory from "./factory";
import BindStrategy from "./bind-strategy";
import AsyncLock from "./async-lock";

type InGlobalScope<T> = Provider<T>;

const lock = new AsyncLock();

function inGlobalScope<T, U = T>(
  factory: Factory<T, U>,
  bindStrategy: BindStrategy<T, U>
): InGlobalScope<T> {
  let value: U | undefined;

  return async (context, next) => {
    const eventEmitter = await context.resolve(
      InternalTokens.AsyncEventEmitter
    );

    if (value !== undefined) {
      await bindStrategy.bind(context, value);
      await bindStrategy.runNext(context, next);

      return;
    }

    const created = await lock.acquire(factory, async () => {
      if (value !== undefined) {
        await bindStrategy.bind(context, value);
        return;
      }

      value = await factory(context);
      await bindStrategy.bind(context, value);

      return value;
    });

    if (created !== undefined) {
      eventEmitter.emit(InternalEvents.Create, created);
      await eventEmitter.emitAsync(InternalEvents.CreateAsync, created);
    }

    await bindStrategy.runNext(context, next);
  };
}

export { InGlobalScope };
export default inGlobalScope;
