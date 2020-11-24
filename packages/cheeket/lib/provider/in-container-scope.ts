import * as interfaces from "../interfaces";
import { EventType } from "../event";

function inContainerScope<T>(
  provider: interfaces.Provider<T>
): interfaces.ContainerScopeProvider<T> {
  const cache = new Map<interfaces.EventEmitter2, T>();

  const scopeProvider: Partial<interfaces.ContainerScopeProvider<T>> = async (
    context: interfaces.Context
  ) => {
    const existed = cache.get(context.container);
    if (existed !== undefined) {
      return existed;
    }

    const value = await provider(context);
    await context.container.emitAsync(EventType.Create, value, context);
    cache.set(context.container, value);

    const listener: interfaces.ClearEventListener = (container) => {
      cache.delete(container);
    };

    context.container.once(EventType.Clear, listener);

    return value;
  };

  scopeProvider.delete = (container: interfaces.Container) => {
    cache.delete(container);
  };

  Object.defineProperty(scopeProvider, "size", { get: () => cache.size });

  return scopeProvider as interfaces.ContainerScopeProvider<T>;
}

export default inContainerScope;
