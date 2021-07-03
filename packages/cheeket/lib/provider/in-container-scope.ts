import AsyncLock from "async-lock";
import Provider from "./provider";
import { ContainerEventEmitter, DefaultState } from "../context";
import emitCreateEvent from "./emit-create-event";
import MiddlewareAdapter from "./middleware-adapter";
import adaptMiddleware from "./adapt-middleware";

function inContainerScope<T, State = DefaultState>(
  provider: Provider<T, State>
): MiddlewareAdapter<T, State> {
  const cache = new Map<string, T>();
  const handleOnClose = (container: ContainerEventEmitter) => {
    cache.delete(container.id);
  };
  const lock = new AsyncLock();

  return adaptMiddleware(async (context) => {
    const value = cache.get(context.container.id);
    if (value != null) {
      return value;
    }
    return lock.acquire(context.container.id, async () => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      let value = cache.get(context.container.id);
      if (value == null) {
        value = await provider(context);

        cache.set(context.container.id, value);

        context.container.addListener("close", handleOnClose);
        await emitCreateEvent(context.container, value);
      }

      return value;
    });
  });
}

export default inContainerScope;
