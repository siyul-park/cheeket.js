import AsyncLock from "async-lock";

import ProviderWrappingOptions from "./provider-wrapping-options";
import Provider from "./provider";
import { ContainerEventEmitter, DefaultState } from "../context";
import { Middleware } from "../middleware";
import bindInContext from "./bind-in-context";
import emitCreateEvent from "./emit-create-event";

function inContainerScope<T, State = DefaultState>(
  provider: Provider<T>,
  options: { array: true }
): Middleware<T[], State>;
function inContainerScope<T, State = DefaultState>(
  provider: Provider<T>,
  options?: { array: false | undefined }
): Middleware<T, State>;
function inContainerScope<T, State = DefaultState>(
  provider: Provider<T>,
  options?: ProviderWrappingOptions
): Middleware<T | T[], State> {
  const cache = new Map<string, T>();
  const handleOnClose = (container: ContainerEventEmitter) => {
    cache.delete(container.id);
  };
  const lock = new AsyncLock();

  return async (context, next) => {
    const value = cache.get(context.container.id);
    if (value != null) {
      bindInContext(context, value, options);
    } else {
      await lock.acquire(context.container.id, async () => {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        let value = cache.get(context.container.id);
        if (value == null) {
          value = await provider(context);

          cache.set(context.container.id, value);

          context.container.addListener("close", handleOnClose);
          await emitCreateEvent(context.container, value);
        }

        bindInContext(context, value, options);
      });
    }

    await next();
  };
}

export default inContainerScope;
