import { EventEmitter2 } from "eventemitter2";
import uniqid from "uniqid";
import * as interfaces from "../interfaces";
import Request from "./request";
import CantResolveError from "../error/cant-resolve-error";
import { Event } from "../event";

class Context implements interfaces.Context {
  id = Symbol(uniqid());

  readonly #bindingDictionary: interfaces.BindingDictionary;

  readonly #eventEmitter: EventEmitter2;

  public readonly children = new Set<interfaces.Context>();

  constructor(
    bindingDictionary: interfaces.BindingDictionary,
    eventEmitter: EventEmitter2,
    public request: interfaces.Request<unknown>,
    public parent?: interfaces.Context
  ) {
    this.#bindingDictionary = bindingDictionary;
    this.#eventEmitter = eventEmitter;
  }

  async resolve<T>(token: interfaces.Token<T>): Promise<T> {
    const provider = this.#bindingDictionary.get(token);
    if (provider !== undefined) {
      const context = this.createChild(token);
      const value = await provider(context);
      context.request.resolved = value;

      await this.#eventEmitter.emitAsync(Event.Resolve, context);

      return value;
    }

    throw new CantResolveError(token, this);
  }

  createChild<T>(token: interfaces.Token<T>): Context {
    const request = new Request(token);
    const context = new Context(
      this.#bindingDictionary,
      this.#eventEmitter,
      request,
      this
    );

    this.children.add(context);

    return context;
  }
}

export default Context;
