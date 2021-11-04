import EventEmitter from "events";

import Resolver from "./resolver";
import Register from "./register";
import Token from "./token";
import Provider from "./provider";
import Storage from "./storage";
import Context from "./context";
import ResolveChain from "./resolve-chain";

import PreDefinedToken from "./pre-defined-token";

class Container implements Resolver, Register {
  private readonly storage: Storage;

  private readonly eventEmitter: EventEmitter;

  private readonly resolveChain: ResolveChain;

  private readonly parent: Container | undefined;

  constructor(parent?: Container) {
    this.storage = new Storage();
    this.eventEmitter = new EventEmitter();
    this.resolveChain = new ResolveChain(this.storage, parent?.resolveChain);
    this.parent = parent;

    this.eventEmitter.setMaxListeners(Infinity);
    this.storage.set(
      PreDefinedToken.EventEmitter,
      (context: Context<EventEmitter>) => {
        context.response = this.eventEmitter;
      }
    );
  }

  register<T>(token: Token<T>, provider: Provider<T>): this {
    this.storage.set(token, provider);
    return this;
  }

  resolve<T>(token: Token<T>): Promise<T | undefined> {
    return this.resolveChain.resolve(token);
  }
}

export default Container;
