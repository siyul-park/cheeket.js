import Provider from "./provider";
import InternalTokens from "./internal-tokens";
import InternalEvents from "./internal-events";
import Factory from "./factory";
import BindStrategy from "./bind-strategy";

type InRequestScope<T> = Provider<T>;

function inRequestScope<T, U = T>(
  factory: Factory<T, U>,
  bindStrategy: BindStrategy<T, U>
): InRequestScope<T> {
  return async (context, next) => {
    const eventEmitter = await context.resolve(InternalTokens.EventEmitter);

    const value = await factory(context);

    eventEmitter.emit(InternalEvents.Create, value);

    await bindStrategy(context, value, next);
  };
}

export { InRequestScope };
export default inRequestScope;