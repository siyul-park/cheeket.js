import * as interfaces from "../interfaces";
import { EventType } from "../event";

function inSingletonScope<T>(
  provider: interfaces.Provider<T>
): interfaces.SingletonScopeProvider<T> {
  let cache: T | undefined;

  const scopeProvider: Partial<interfaces.SingletonScopeProvider<T>> = async (
    context: interfaces.Context
  ) => {
    if (cache === undefined) {
      const value = await provider(context);
      await context.container.emitAsync(EventType.Create, value, context);
      cache = value;
    }

    return cache;
  };

  scopeProvider.clear = () => {
    cache = undefined;
  };

  return scopeProvider as interfaces.SingletonScopeProvider<T>;
}

export default inSingletonScope;
