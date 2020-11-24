import * as interfaces from "../interfaces";
import { EventType } from "../event";

function inRequestScope<T>(
  provider: interfaces.Provider<T>
): interfaces.Provider<T> {
  return async (context: interfaces.Context) => {
    const value = await provider(context);
    await context.container.emitAsync(EventType.Create, value, context);
    return value;
  };
}

export default inRequestScope;
