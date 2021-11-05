import Resolver from "./resolver";
import Register from "./register";
import Token from "./token";
import Middleware from "./middleware";
import MiddlewareStorage from "./middleware-storage";
import ResolveProcessor from "./resolve-processor";
import AsyncEventEmitter from "./async-event-emitter";

import proxy from "./middleware/proxy";
import chain from "./middleware/chain";
import route from "./middleware/route";

import InternalTokens from "./internal-tokens";
import InternalEvents from "./internal-events";

class Container implements Resolver, Register {
  private readonly storage: MiddlewareStorage;

  private readonly eventEmitter: AsyncEventEmitter;

  private readonly resolveProcessor: ResolveProcessor;

  constructor(parent?: Container) {
    this.storage = new MiddlewareStorage();
    this.eventEmitter = new AsyncEventEmitter();

    this.eventEmitter.setMaxListeners(Infinity);

    this.storage.set(InternalTokens.AsyncEventEmitter, async (context, next) => {
      context.response = this.eventEmitter;
      await next();
    });
    this.storage.set(InternalTokens.PipeLine, chain(parent?.resolveProcessor));
    this.storage.set(InternalTokens.PipeLine, route(this.storage));

    this.resolveProcessor = new ResolveProcessor(proxy(this.storage, InternalTokens.PipeLine));
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
    return this.storage.has(token, middleware);
  }

  resolveOrDefault<T, D>(token: Token<T>, other: D): Promise<T | D> {
    return this.resolveProcessor.resolveOrDefault(token, other);
  }

  resolve<T>(token: Token<T>): Promise<T> {
    return this.resolveProcessor.resolve(token);
  }

  clear(): void {
    const internalTokens = new Set<Token<unknown>>(Object.values(InternalTokens));

    this.storage.keys().forEach((key) => {
      if (!internalTokens.has(key)) {
        this.storage.delete(key);
      }
    });

    this.eventEmitter.emit(InternalEvents.Clear);
  }

  createChild(): Container {
    return new Container(this);
  }
}

export default Container;
