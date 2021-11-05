import Middleware from "./middleware";
import MiddlewareStorage from "./middleware-storage";

function route(storage: MiddlewareStorage): Middleware<unknown> {
  return async (context, next) => {
    await next();

    if (context.response === undefined) {
      const middleware = storage.get(context.request);
      await middleware?.(context, async () => {});
    }
  };
}

export default route;
