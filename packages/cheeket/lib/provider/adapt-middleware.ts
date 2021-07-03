import { Context, DefaultState } from "../context";
import { Next } from "../middleware";
import Provider from "./provider";
import MiddlewareAdapter, {
  MiddlewareAdapterOptions,
} from "./middleware-adapter";
import emitResolveEvent from "./emit-resolve-event";

function adaptMiddleware<T, State = DefaultState>(
  provider: Provider<T, State>
): MiddlewareAdapter<T, State> {
  const adapter: Omit<MiddlewareAdapter<T, State>, "bind"> &
    Partial<Pick<MiddlewareAdapter<T, State>, "bind">> = provider;

  adapter.bind = (options?: MiddlewareAdapterOptions) => {
    const isArray = options?.array === true;
    return async (context: Context<unknown, State>, next: Next) => {
      const result = await provider(context);
      if (isArray) {
        const values = (context.response ?? []) as T[];
        values.push(result);
        context.response = values;
      } else {
        context.response = result;
      }

      await emitResolveEvent(context.container, result);
      await next();
    };
  };

  return adapter as MiddlewareAdapter<T, State>;
}

export default adaptMiddleware;
