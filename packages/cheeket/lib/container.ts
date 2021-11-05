import Resolver from "./resolver";
import Register from "./register";
import Token from "./token";
import Provider from "./provider";
import ProviderStorage from "./provider-storage";
import ResolveProcessor from "./resolve-processor";
import AsyncEventEmitter from "./async-event-emitter";

import InternalTokens from "./internal-tokens";
import InternalEvents from "./internal-events";
import middlewareProxy from "./middleware-proxy";
import chainProcessor from "./chain-processor";
import routeProvider from "./route-provider";

class Container implements Resolver, Register {
  private readonly storage: ProviderStorage;

  private readonly eventEmitter: AsyncEventEmitter;

  private readonly resolveProcessor: ResolveProcessor;

  constructor(parent?: Container) {
    this.storage = new ProviderStorage();
    this.eventEmitter = new AsyncEventEmitter();
    this.resolveProcessor = new ResolveProcessor(middlewareProxy(this.storage));

    this.eventEmitter.setMaxListeners(Infinity);

    this.storage.set(InternalTokens.AsyncEventEmitter, async (context, next) => {
      context.response = this.eventEmitter;
      await next();
    });
    this.storage.set(InternalTokens.Middleware, chainProcessor(parent?.resolveProcessor));
    this.storage.set(InternalTokens.Middleware, routeProvider(this.storage));
  }

  use(...middlewares: Provider<unknown>[]): this {
    middlewares.forEach((middleware) => {
      this.storage.set(InternalTokens.Middleware, middleware);
    });
    return this;
  }

  register<T>(token: Token<T>, provider: Provider<T>): this {
    if (!this.isRegister(token, provider)) {
      this.storage.set(token, provider);
    }
    return this;
  }

  unregister<T>(token: Token<T>, provider?: Provider<T>): this {
    this.storage.delete(token, provider);
    return this;
  }

  isRegister<T>(token: Token<T>, provider?: Provider<T>): boolean {
    return this.storage.has(token, provider);
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
