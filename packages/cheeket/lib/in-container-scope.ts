import EventEmitter from "events";
import Provider from "./provider";
import InternalTokens from "./internal-tokens";
import InternalEvents from "./internal-events";
import Factory from "./factory";
import BindStrategy from "./bind-strategy";

interface InContainerScope<T> extends Provider<T> {
  get size(): number;
}

function inContainerScope<T, U = T>(
  factory: Factory<T, U>,
  bindStrategy: BindStrategy<T, U>
): InContainerScope<T> {
  const values = new Map<EventEmitter, U>();

  const provider: Provider<T> = async (context, next) => {
    const eventEmitter = await context.resolve(InternalTokens.EventEmitter);

    const founded = values.get(eventEmitter);
    if (founded !== undefined) {
      await bindStrategy(context, founded, next);
      return;
    }

    const value = await factory(context);

    if (value !== undefined) {
      values.set(eventEmitter, value);

      const clearListener = () => {
        eventEmitter.removeListener(InternalEvents.Clear, clearListener);
        values.delete(eventEmitter);
      };
      eventEmitter.addListener(InternalEvents.Clear, clearListener);

      await bindStrategy(context, value, next);
    }
  };

  return Object.assign(provider, {
    get size(): number {
      return values.size;
    },
  });
}

export { InContainerScope };
export default inContainerScope;
