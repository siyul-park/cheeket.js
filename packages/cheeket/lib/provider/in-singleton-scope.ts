import * as interfaces from "../interfaces";
import { EventType } from "../event";

function inSingletonScope<T>(
  provider: interfaces.Provider<T>
): interfaces.ScopeProvider<T> {
  let cache: T | undefined;

  const scopeProvider: Partial<interfaces.ScopeProvider<T>> = async (
    context: interfaces.Context
  ) => {
    if (cache === undefined) {
      const value = await provider(context);
      await context.emitAsync(EventType.Create, value, context);
      cache = value;
    }

    return cache;
  };

  scopeProvider.clear = () => {
    cache = undefined;
  };

  return scopeProvider as interfaces.ScopeProvider<T>;
}

export default inSingletonScope;
