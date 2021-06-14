import Middleware from "./middleware";

interface MiddlewarePipeline {
  use(...middlewares: Middleware<unknown, unknown>[]): void;
}

export default MiddlewarePipeline;
