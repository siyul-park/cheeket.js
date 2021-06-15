import Binder from "./binder";
import { Token } from "../token";
import { Middleware } from "../middleware";
import { DefaultState } from "../context";

class BinderAdapter<State = DefaultState> implements Binder<State> {
  constructor(
    private readonly bindMap: Map<
      Token<unknown>,
      Middleware<unknown, unknown>[]
    >
  ) {}

  bind<T>(token: Token<T>, middleware: Middleware<T, State>): void {
    if (this.isBound(token, middleware)) {
      return;
    }

    const middlewares = this.bindMap.get(token) ?? [];
    middlewares.push(middleware as Middleware<unknown, unknown>);
    this.bindMap.set(token, middlewares);
  }

  unbind<T>(token: Token<T>, middleware?: Middleware<T, State>): void {
    if (middleware == null) {
      this.bindMap.delete(token);
      return;
    }

    const middlewares = this.bindMap.get(token);
    if (middlewares == null) {
      return;
    }

    const index = middlewares.findIndex((value) => value === middleware);
    if (index >= 0) {
      middlewares.splice(index, 1);
    }
  }

  isBound<T>(token: Token<T>, middleware?: Middleware<T, State>): boolean {
    if (middleware == null) {
      return this.bindMap.has(token);
    }

    const middlewares = this.bindMap.get(token);
    if (middlewares == null) {
      return false;
    }

    return middlewares.findIndex((value) => value === middleware) >= 0;
  }
}

export default BinderAdapter;
