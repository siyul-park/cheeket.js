import AsyncLock from "async-lock";
import uniqid from "uniqid";

import ProviderWrappingOptions from "./provider-wrapping-options";
import Provider from "./provider";
import { DefaultState } from "../context";
import { Middleware } from "../middleware";
import bindInContext from "./bind-in-context";
import emitCreateEvent from "./emit-create-event";

const lock = new AsyncLock();

function inSingletonScope<T, State = DefaultState>(
  provider: Provider<T>,
  options: { array: true }
): Middleware<T[], State>;
function inSingletonScope<T, State = DefaultState>(
  provider: Provider<T>,
  options?: { array: false | undefined }
): Middleware<T, State>;
function inSingletonScope<T, State = DefaultState>(
  provider: Provider<T>,
  options?: ProviderWrappingOptions
): Middleware<T | T[], State> {
  let cache: T | undefined;
  const id = uniqid();

  return async (context, next) => {
    if (cache != null) {
      bindInContext(context, cache, options);
    } else {
      await lock.acquire(id, async () => {
        if (cache == null) {
          cache = await provider(context);
          await emitCreateEvent(context.container, cache);
        }

        bindInContext(context, cache, options);
      });
    }

    await next();
  };
}

export default inSingletonScope;
