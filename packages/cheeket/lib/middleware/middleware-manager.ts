import Middleware from "./middleware";
import MiddlewarePipeline from "./middleware-pipeline";
import joinMiddleware from "./join-middleware";

class MiddlewareManager implements MiddlewarePipeline {
  private cache?: Middleware<unknown, unknown>;

  constructor(
    private readonly middlewares: Middleware<unknown, unknown>[] = []
  ) {}

  use(...middlewares: Middleware<unknown, unknown>[]): void {
    this.middlewares.push(...middlewares);
    this.cache = undefined;
  }

  get size(): number {
    return this.middlewares.length;
  }

  compact(): Middleware<unknown, unknown> {
    if (this.cache != null) {
      return this.cache;
    }
    const middleware = joinMiddleware(...this.middlewares);
    this.cache = middleware;

    return middleware;
  }
}

export default MiddlewareManager;
