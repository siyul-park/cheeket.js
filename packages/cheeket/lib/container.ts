import Resolver from "./resolver";
import Register from "./register";
import Token from "./token";
import Middleware, { chain, proxy, route, MiddlewareStorage } from "./middleware";
import ResolveProcessor from "./resolve-processor";
import AsyncEventEmitter from "./async-event-emitter";

import InternalTokens from "./internal-tokens";
import InternalEvents from "./internal-events";

class Container extends AsyncEventEmitter implements Resolver, Register {
  private readonly storage: MiddlewareStorage;

  private readonly resolveProcessor: ResolveProcessor;

  constructor(private readonly parent?: Container) {
    super();

    this.storage = new MiddlewareStorage();

    this.storage.set(InternalTokens.AsyncEventEmitter, async (context, next) => {
      context.response = this;
      await next();
    });
    this.storage.set(InternalTokens.PipeLine, chain(parent?.resolveProcessor));
    this.storage.set(InternalTokens.PipeLine, route(this.storage));

    this.resolveProcessor = new ResolveProcessor(proxy(this.storage, InternalTokens.PipeLine));

    this.setMaxListeners(Infinity);

    parent?.on(InternalEvents.PreClear, (cleared: unknown) => {
      if (cleared === parent) {
        this.clear();
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

  resolveOrDefault<T, D>(token: Token<T>, other: D): Promise<T | D> {
    return this.resolveProcessor.resolveOrDefault(token, other);
  }

  resolve<T>(token: Token<T>): Promise<T> {
    return this.resolveProcessor.resolve(token);
  }

  clear(): void {
    this.emit(InternalEvents.PreClear, this);

    const internalTokens = new Set<Token<unknown>>(Object.values(InternalTokens));

    this.storage.keys().forEach((key) => {
      if (!internalTokens.has(key)) {
        this.storage.delete(key);
      }
    });

    this.emit(InternalEvents.PostClear, this);
  }

  createChild(): Container {
    return new Container(this);
  }
}

export default Container;
