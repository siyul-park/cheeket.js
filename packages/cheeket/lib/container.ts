import EventEmitter from "events";

import Resolver from "./resolver";
import Register from "./register";
import Token from "./token";
import Provider from "./provider";
import ProviderStorage from "./provider-storage";
import ResolveChain from "./resolve-chain";

import InternalTokens from "./internal-tokens";
import InternalEvents from "./internal-events";

class Container implements Resolver, Register {
  private readonly storage: ProviderStorage;

  private readonly eventEmitter: EventEmitter;

  private readonly resolveChain: ResolveChain;

  private readonly parent: Container | undefined;

  constructor(parent?: Container) {
    this.storage = new ProviderStorage();
    this.eventEmitter = new EventEmitter();
    this.resolveChain = new ResolveChain(this.storage, parent?.resolveChain);
    this.parent = parent;

    this.eventEmitter.setMaxListeners(Infinity);
    this.storage.set(InternalTokens.EventEmitter, async (context, next) => {
      context.response = this.eventEmitter;
      await next();
    });
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
    return this.resolveChain.resolveOrDefault(token, other);
  }

  resolve<T>(token: Token<T>): Promise<T> {
    return this.resolveChain.resolve(token);
  }

  clear(): void {
    const internalTokens = new Set<Token<unknown>>(
      Object.values(InternalTokens)
    );

    this.storage.keys().forEach((key) => {
      if (!internalTokens.has(key)) {
        this.storage.delete(key);
      }
    });

    this.eventEmitter.emit(InternalEvents.Clear);
  }
}

export default Container;
