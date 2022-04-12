import Register from './register';
import Token from './token';
import Middleware, { chain, proxy, route, MiddlewareStorage } from './middleware';
import Resolver, { NestedResolver } from './resolver';
import { AsyncEventEmitter } from './async';

import InternalTokens from './internal-tokens';
import InternalEvents from './internal-events';

class Container extends AsyncEventEmitter implements Resolver, Register {
  private readonly storage = new MiddlewareStorage();

  private readonly resolver = new NestedResolver(proxy(this.storage, InternalTokens.PipeLine));

  constructor(private readonly parent?: Container) {
    super();

    this.storage.set(InternalTokens.AsyncEventEmitter, async (context, next) => {
      context.response = this;
      await next();
    });
    this.storage.set(InternalTokens.PipeLine, chain(parent?.resolver));
    this.storage.set(InternalTokens.PipeLine, route(this.storage));

    parent?.on(InternalEvents.PreClear, async (cleared: unknown) => {
      if (cleared === parent) {
        await this.clear();
      }
    });

    this.on(InternalEvents.Clear, (cleared: unknown) => {
      if (cleared === this) {
        const internalTokens = new Set<Token<unknown>>(Object.values(InternalTokens));
        this.storage.keys().forEach((key) => {
          if (!internalTokens.has(key)) {
            this.storage.delete(key);
          }
        });
      }
    });
  }

  use(...middlewares: Middleware<unknown>[]): this {
    middlewares.forEach((middleware) => {
      this.storage.set(InternalTokens.PipeLine, middleware);
    });
    return this;
  }

  register<T>(token: Token<T>, middleware: Middleware<T>): this {
    if (!this.isRegister(token, middleware)) {
      this.storage.set(token, middleware);
    }
    return this;
  }

  unregister<T>(token: Token<T>, middleware?: Middleware<T>): this {
    this.storage.delete(token, middleware);
    return this;
  }

  isRegister<T>(token: Token<T>, middleware?: Middleware<T>): boolean {
    const registered = this.storage.has(token, middleware);
    if (registered) {
      return registered;
    }

    return this.parent?.isRegister(token, middleware) ?? false;
  }

  resolveOr<T, D>(token: Token<T>, other: D): Promise<T | D> {
    return this.resolver.resolveOr(token, other);
  }

  resolve<T>(token: Token<T>): Promise<T> {
    return this.resolver.resolve(token);
  }

  async clear(): Promise<void> {
    await this.emit(InternalEvents.PreClear, this);
    await this.emit(InternalEvents.Clear, this);
    await this.emit(InternalEvents.PostClear, this);
  }

  child(): Container {
    return new Container(this);
  }
}

export default Container;
