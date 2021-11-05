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

    await lock.acquire(factory, async () => {
      if (value !== undefined) {
        await bindStrategy.bind(context, value);
        return;
      }

      value = await factory(context);
      await bindStrategy.bind(context, value);

      eventEmitter.emit(InternalEvents.Create, value);
      await eventEmitter.emitAsync(InternalEvents.CreateAsync, value);
    });

    await bindStrategy.runNext(context, next);
  };
}

export { InGlobalScope };
export default inGlobalScope;
