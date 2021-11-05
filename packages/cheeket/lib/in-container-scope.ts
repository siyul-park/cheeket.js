import EventEmitter from "events";
import Provider from "./provider";
import InternalTokens from "./internal-tokens";
import InternalEvents from "./internal-events";

interface InContainerScope<T> extends Provider<T> {
  get size(): number;
}

function inContainerScope<T>(provider: Provider<T>): InContainerScope<T> {
  const values = new Map<EventEmitter, T>();

  const scopeProvider: Provider<T> = async (context, next) => {
    const eventEmitter = await context.resolve(InternalTokens.EventEmitter);

    const founded = values.get(eventEmitter);
    if (founded !== undefined) {
      context.response = founded;
      await next();
      return;
    }

    await provider(context, next);

    if (context.response !== undefined) {
      values.set(eventEmitter, context.response);

      const clearListener = () => {
        eventEmitter.removeListener(InternalEvents.Clear, clearListener);
        values.delete(eventEmitter);
      };
      eventEmitter.addListener(InternalEvents.Clear, clearListener);
    }
  };

  return Object.assign(scopeProvider, {
    get size(): number {
      return values.size;
    },
  });
}

export { InContainerScope };
export default inContainerScope;
