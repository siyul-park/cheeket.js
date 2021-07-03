import AsyncLock from "async-lock";
import uniqid from "uniqid";

import Provider from "./provider";
import { DefaultState } from "../context";
import emitCreateEvent from "./emit-create-event";
import MiddlewareAdapter from "./middleware-adapter";
import adaptMiddleware from "./adapt-middleware";

const lock = new AsyncLock();

function inSingletonScope<T, State = DefaultState>(
  provider: Provider<T, State>
): MiddlewareAdapter<T, State> {
  let cache: T | undefined;
  const id = uniqid();

  return adaptMiddleware(async (context) => {
    if (cache != null) {
      return cache;
    }
    return lock.acquire(id, async () => {
      if (cache == null) {
        cache = await provider(context);
        await emitCreateEvent(context.container, cache);
      }

      return cache;
    });
  });
}

export default inSingletonScope;
