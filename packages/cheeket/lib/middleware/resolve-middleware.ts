import Middleware from "./middleware";
import joinMiddleware from "./join-middleware";
import { Token } from "../token";

function resolveMiddleware(
  bindMap: Map<Token<unknown>, Middleware<unknown, unknown>[]>
): Middleware<unknown, unknown> {
  return async (context, next) => {
    const current = bindMap.get(context.request);
    if (current != null) {
      await joinMiddleware(...current)(context, next);
    } else {
      await next();
    }
  };
}

export default resolveMiddleware;
