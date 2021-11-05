import Token from "../token";
import Middleware from "./middleware";
import compose from "./compose";

class MiddlewareStorage {
  private readonly map = new Map<Token<unknown>, Middleware<unknown>[]>();

  private readonly cache = new Map<Token<unknown>, Middleware<unknown>>();

  get<T>(token: Token<T>): Middleware<T> | undefined {
    const cached = this.cache.get(token);
    if (cached != null) {
      return cached;
    }

    const middlewares = this.map.get(token) as Middleware<T>[] | undefined;
    if (middlewares === undefined) {
      return undefined;
    }

    const middleware = compose(middlewares);
    this.cache.set(token, middleware as Middleware<unknown>);

    return middleware;
  }

  set<T>(token: Token<T>, middleware: Middleware<T>): void {
    const middlewares = this.map.get(token) ?? [];
    middlewares.push(middleware as Middleware<unknown>);

    this.map.set(token, middlewares);
    this.cache.delete(token);
  }

  delete<T>(token: Token<T>, middleware?: Middleware<T>): void {
    if (middleware == null) {
      this.map.delete(token);
      this.cache.delete(token);
    } else {
      const middlewares = this.map.get(token);
      if (middlewares === undefined) {
        return;
      }

      const index = middlewares.findIndex((cur) => cur === middleware);
      if (index > -1) {
        middlewares.splice(index, 1);
        if (middlewares.length === 0) {
          this.map.delete(token);
        }
        this.cache.delete(token);
      }
    }
  }

  has<T>(token: Token<T>, middleware?: Middleware<T>): boolean {
    if (middleware == null) {
      return this.map.has(token);
    }
    const middlewares = this.map.get(token);
    if (middlewares === undefined) {
      return false;
    }

    return middlewares.findIndex((cur) => cur === middleware) > -1;
  }

  keys(): Token<unknown>[] {
    return Array.from(this.map.keys());
  }
}

export default MiddlewareStorage;
