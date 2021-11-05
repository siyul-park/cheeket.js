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
    const eventEmitter = await context.resolve(
      InternalTokens.AsyncEventEmitter
    );

    const value = await factory(context);

    await bindStrategy.bind(context, value);

    eventEmitter.emit(InternalEvents.Create, value);
    await eventEmitter.emitAsync(InternalEvents.CreateAsync, value);

    await bindStrategy.runNext(next);
  };
}

export { InRequestScope };
export default inRequestScope;
