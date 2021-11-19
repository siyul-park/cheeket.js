import InternalTokens from "../internal-tokens";
import InternalEvents from "../internal-events";
import Factory from "../factory";
import AsyncLock from "../async-lock";
import Middleware from "../middleware";
import BindStrategy from "../bind-strategy";

interface InGlobalScope<T> extends Middleware<T> {
  clear(): void;
}

const lock = new AsyncLock();

function inGlobalScope<T, U = T>(factory: Factory<T, U>, bindStrategy: BindStrategy<T, U>): InGlobalScope<T> {
  let value: U | undefined;

  const middleware: Middleware<T> = async (context, next) => {
    const eventEmitter = await context.resolve(InternalTokens.AsyncEventEmitter);

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

      eventEmitter.emit(InternalEvents.Create, context);
      await eventEmitter.emitAsync(InternalEvents.CreateAsync, context);
    });

    await bindStrategy.runNext(context, next);
  };

  Object.assign(middleware, {
    clear(): void {
      value = undefined;
    },
  });

  return middleware as InGlobalScope<T>;
}

export { InGlobalScope };
export default inGlobalScope;
