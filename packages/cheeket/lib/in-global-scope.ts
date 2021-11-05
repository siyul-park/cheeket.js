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
    const eventEmitter = await context.resolve(InternalTokens.EventEmitter);

    await lock.acquire(factory, async () => {
      if (value !== undefined) {
        await bindStrategy(context, value, next);
        return;
      }

      value = await factory(context);

      eventEmitter.emit(InternalEvents.Create, value);

      await bindStrategy(context, value, next);
    });
  };
}

export { InGlobalScope };
export default inGlobalScope;
