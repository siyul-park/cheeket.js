import Middleware from "./middleware";

function joinMiddleware(
  ...middleware: Middleware<unknown, unknown>[]
): Middleware<unknown, unknown> {
  return middleware.reduceRight((prev, curr) => {
    return async (context, next) => {
      await curr(context, async () => {
        await prev(context, next);
      });
    };
  });
}

export default joinMiddleware;
