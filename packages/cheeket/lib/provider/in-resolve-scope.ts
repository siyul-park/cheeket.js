import * as interfaces from "../interfaces";
import { EventType } from "../event";

function findRoot(context: interfaces.Context): interfaces.Context {
  let current: interfaces.Context = context;
  while (current.parent !== undefined) {
    current = current.parent;
  }

  return current;
}

function inResolveScope<T>(
  provider: interfaces.Provider<T>
): interfaces.Provider<T> {
  const cache = new Map<symbol, T>();

  return async (context: interfaces.Context) => {
    const root = findRoot(context);
    const existed = cache.get(root.id);
    if (existed !== undefined) {
      return existed;
    }

    const value = await provider(context);
    await context.container.emitAsync(EventType.Create, value, context);
    cache.set(root.id, value);

    const listener: interfaces.ResolveEventListener = (ctx) => {
      if (ctx === root) {
        cache.delete(root.id);
      }
    };

    context.container.once(EventType.Resolve, listener);

    return value;
  };
}

export default inResolveScope;
