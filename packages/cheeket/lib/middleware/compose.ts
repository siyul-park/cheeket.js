import Middleware from "../middleware";
import Context from "../context";
import Next from "../next";

function compose<T>(
  middlewares: (Middleware<T> | undefined | null)[],
  filter: (context: Context<T>) => boolean = () => true
): Middleware<T> | undefined {
  const existedProviders = middlewares.filter((provider) => provider != null) as Middleware<T>[];

  if (existedProviders.length === 0) {
    return undefined;
  }

  return existedProviders.reverse().reduce((pre, cur) => {
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
