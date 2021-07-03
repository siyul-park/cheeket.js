import Provider from "./provider";
import { DefaultState } from "../context";
import MiddlewareAdapter from "./middleware-adapter";
import adaptMiddleware from "./adapt-middleware";
import emitCreateEvent from "./emit-create-event";

function inRequestScope<T, State = DefaultState>(
  provider: Provider<T, State>
): MiddlewareAdapter<T, State> {
  return adaptMiddleware(async (context) => {
    const value = await provider(context);
    await emitCreateEvent(context.container, value);

    return value;
  });
}

export default inRequestScope;
