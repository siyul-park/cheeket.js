import * as interfaces from "../interfaces";
import { EventType } from "../event";

function inRequestScope<T>(
  provider: interfaces.Provider<T>
): interfaces.ScopeProvider<T> {
  const scopeProvider: Partial<interfaces.ScopeProvider<T>> = async (
    context: interfaces.Context
  ) => {
    const value = await provider(context);
    await context.emitAsync(EventType.Create, value, context);
    return value;
  };

  scopeProvider.clear = () => {};

  return scopeProvider as interfaces.ScopeProvider<T>;
}

export default inRequestScope;
