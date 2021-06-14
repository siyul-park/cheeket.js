import ProviderWrappingOptions from "./provider-wrapping-options";
import Provider from "./provider";
import { DefaultState } from "../context";
import { Middleware } from "../middleware";
import bindInContext from "./bind-in-context";

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

  return async (context, next) => {
    if (cache == null) {
      cache = await provider(context);
      context.container.emit("create", cache);
    }

    bindInContext(context, cache, options);

    await next();
  };
}

export default inSingletonScope;
