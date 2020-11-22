import uniqid from "uniqid";
import * as interfaces from "../interfaces";
import Request from "./request";
import CantResolveError from "../error/cant-resolve-error";
import { EventType } from "../event";

class Context implements interfaces.Context {
  id = Symbol(uniqid());

  readonly #bindingDictionary: interfaces.BindingDictionary;

  readonly #eventProducer: interfaces.EventProducer;

  public readonly children = new Set<interfaces.Context>();

  constructor(
    bindingDictionary: interfaces.BindingDictionary,
    eventProducer: interfaces.EventProducer,
    public request: interfaces.Request<unknown>,
    public parent?: interfaces.Context
  ) {
    this.#bindingDictionary = bindingDictionary;
    this.#eventProducer = eventProducer;
  }

  async resolve<T>(token: interfaces.Token<T>): Promise<T> {
    const provider = this.#bindingDictionary.get(token);
    if (provider !== undefined) {
      return this.resolveProvider(provider, token);
    }

    throw new CantResolveError(token, this);
  }

  async resolveAll<T>(token: interfaces.Token<T>): Promise<T[]> {
    const providers = this.#bindingDictionary.getAll(token);
    if (providers.length > 0) {
      return Promise.all(
        providers.map((provider) => this.resolveProvider(provider, token))
      );
    }

    throw new CantResolveError(token, this);
  }

  private async resolveProvider<T>(
    provider: interfaces.Provider<T>,
    token: interfaces.Token<T>
  ): Promise<T> {
    const context = this.createChild(token);
    const value = await provider(context);
    context.request.resolved = value;

    await this.#eventProducer.emitAsync(EventType.Resolve, context);

    return value;
  }

  createChild<T>(token: interfaces.Token<T>): Context {
    const request = new Request(token);
    const context = new Context(
      this.#bindingDictionary,
      this.#eventProducer,
      request,
      this
    );

    this.children.add(context);

    return context;
  }

  emit(event: interfaces.EventToken, ...values: any[]): boolean {
    return this.#eventProducer.emit(event, ...values);
  }

  emitAsync(event: interfaces.EventToken, ...values: any[]): Promise<any[]> {
    return this.#eventProducer.emitAsync(event, ...values);
  }
}

export default Context;
