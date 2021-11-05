import Provider from "./provider";
import InternalTokens from "./internal-tokens";
import InternalEvents from "./internal-events";
import Factory from "./factory";
import BindStrategy from "./bind-strategy";

type InGlobalScope<T> = Provider<T>;

function inGlobalScope<T, U = T>(
  factory: Factory<T, U>,
  bindStrategy: BindStrategy<T, U>
): InGlobalScope<T> {
  let value: U | undefined;

  return async (context, next) => {
    const eventEmitter = await context.resolve(InternalTokens.EventEmitter);

    if (value !== undefined) {
      await bindStrategy(context, value, next);
      return;
    }

    value = await factory(context);

    eventEmitter.emit(InternalEvents.Create, value);

    await bindStrategy(context, value, next);
  };
}

export { InGlobalScope };
export default inGlobalScope;
