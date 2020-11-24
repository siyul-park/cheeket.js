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
): interfaces.ResolveScopeProvider<T> {
  const cache = new Map<symbol, T>();

  const scopeProvider: Partial<interfaces.Provider<T>> = async (
    context: interfaces.Context
  ) => {
    const root = findRoot(context);
    const existed = cache.get(root.id);
    if (existed !== undefined) {
      return existed;
    }

    const value = await provider(context);
    await context.container.emitAsync(EventType.Create, value, context);
    cache.set(root.id, value);

    const listener: interfaces.ResolveEventListener = (ctx) => {
      if (ctx.id === root.id) {
        cache.delete(root.id);
        context.container.removeListener(EventType.Resolve, listener);
      }
    };

    context.container.addListener(EventType.Resolve, listener);

    return value;
  };

  Object.defineProperty(scopeProvider, "size", { get: () => cache.size });

  return scopeProvider as interfaces.ResolveScopeProvider<T>;
}

export default inResolveScope;
