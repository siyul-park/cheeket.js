import EventEmitter from "events";
import ProviderWrappingOptions from "./provider-wrapping-options";
import Provider from "./provider";
import { DefaultState } from "../context";
import { Middleware } from "../middleware";
import bindInContext from "./bind-in-context";

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
  const cache = new Map<EventEmitter, T>();
  const handleOnClose = (container: EventEmitter) => {
    cache.delete(container);
  };

  return async (context, next) => {
    let value = cache.get(context.container);
    if (value != null) {
      value = await provider(context);

      cache.set(context.container, value);

      context.container.addListener("close", handleOnClose);
      context.container.emit("create", value);
    }

    bindInContext(context, value, options);

    await next();
  };
}

export default inContainerScope;
