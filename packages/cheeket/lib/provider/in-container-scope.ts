import * as interfaces from "../interfaces";
import { EventType } from "../event";

function inContainerScope<T>(
  provider: interfaces.Provider<T>
): interfaces.ContainerScopeProvider<T> {
  const cache = new Map<symbol, T>();

  const scopeProvider: Partial<interfaces.ContainerScopeProvider<T>> = async (
    context: interfaces.Context
  ) => {
    const existed = cache.get(context.container.id);
    if (existed !== undefined) {
      return existed;
    }

    const value = await provider(context);
    await context.container.emitAsync(EventType.Create, value, context);
    cache.set(context.container.id, value);

    const listener: interfaces.ClearEventListener = (container) => {
      cache.delete(container.id);
    };

    context.container.once(EventType.Clear, listener);

    return value;
  };

  scopeProvider.delete = (container: interfaces.Container) => {
    cache.delete(container.id);
  };

  Object.defineProperty(scopeProvider, "size", { get: () => cache.size });

  return scopeProvider as interfaces.ContainerScopeProvider<T>;
}

export default inContainerScope;
