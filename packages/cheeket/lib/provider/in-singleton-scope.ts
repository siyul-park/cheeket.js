import * as interfaces from "../interfaces";
import { EventType } from "../event";

function inSingletonScope<T>(
  provider: interfaces.Provider<T>
): interfaces.Provider<T> {
  let cache: T | undefined;
  return async (context: interfaces.Context) => {
    if (cache === undefined) {
      const value = await provider(context);
      await context.emitAsync(EventType.Create, value, context);
      cache = value;
    }

    return cache;
  };
}

export default inSingletonScope;
