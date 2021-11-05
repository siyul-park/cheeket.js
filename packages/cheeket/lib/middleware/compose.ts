import Middleware from "./middleware";
import Context from "../context";
import Next from "../next";

function compose<T>(
  middlewares: (Middleware<T> | undefined | null)[],
  filter: (context: Context<T>) => boolean = () => true
): Middleware<T> | undefined {
  const existedmiddlewares = middlewares.filter((middleware) => middleware != null) as Middleware<T>[];

  if (existedmiddlewares.length === 0) {
    return undefined;
  }

  return existedmiddlewares.reverse().reduce((pre, cur) => {
    return async (context: Context<T>, next: Next) => {
      await cur(context, async () => {
        if (filter(context)) {
          await pre(context, next);
        }
      });
    };
  });
}

export default compose;
