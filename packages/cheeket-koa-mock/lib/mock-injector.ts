import { Middleware, Token, DefaultState, Binder } from "cheeket";

class MockInjector<State = DefaultState> implements Binder<State> {
  private readonly middlewares = new Map<
    Token<unknown>,
    Middleware<unknown, State>
  >();

  bind<T>(token: Token<T>, middleware: Middleware<T, State>): void {
    this.middlewares.set(token, middleware as Middleware<unknown, State>);
  }

  unbind<T>(token: Token<T>, middleware?: Middleware<T, State>): void {
    if (this.isBound(token, middleware)) {
      this.middlewares.delete(token);
    }
  }

  isBound<T>(token: Token<T>, middleware?: Middleware<T, State>): boolean {
    const bindMiddleware = this.middlewares.get(token);
    if (middleware == null) {
      return bindMiddleware != null;
    }

    return bindMiddleware === middleware;
  }

  compact(): Middleware<unknown, State> {
    return async (context, next) => {
      const token = context.request;
      const middleware = this.middlewares.get(token);

      if (middleware != null) {
        await middleware(context, async () => {
          if (context.response != null) {
            return;
          }
          await next();
        });
      } else {
        await next();
      }
    };
  }
}

export default MockInjector;
