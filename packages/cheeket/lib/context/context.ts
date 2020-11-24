import uniqid from "uniqid";
import * as interfaces from "../interfaces";
import Request from "./request";
import CantResolveError from "../error/cant-resolve-error";
import { EventType } from "../event";

class Context implements interfaces.Context {
  id = Symbol(uniqid());

  readonly #bindingDictionaries: interfaces.BindingDictionary[];

  readonly #eventProducer: interfaces.EventProducer;

  public readonly children = new Set<interfaces.Context>();

  constructor(
    bindingDictionaries: interfaces.BindingDictionary[],
    eventProducer: interfaces.EventProducer,
    public request: interfaces.Request<unknown>,
    public parent?: interfaces.Context
  ) {
    this.#bindingDictionaries = bindingDictionaries;
    this.#eventProducer = eventProducer;
  }

  async resolve<T>(token: interfaces.Token<T>): Promise<T> {
    const [
      provider,
      bindingDictionaryIndex,
    ] = this.findProviderAndBindingDictionaryIndex(token);
    return this.resolveProvider(provider, token, bindingDictionaryIndex);
  }

  async resolveAll<T>(token: interfaces.Token<T>): Promise<T[]> {
    const providersAndIndexList = this.findProvidersAndBindingDictionaryIndex(
      token
    );
    if (providersAndIndexList.length > 0) {
      return Promise.all(
        providersAndIndexList
          .map(([providers, bindingDictionaryIndex]) =>
            providers.map((provider) =>
              this.resolveProvider(provider, token, bindingDictionaryIndex)
            )
          )
          .reduce((acc, cur) => acc.concat(cur), [])
      );
    }

    throw new CantResolveError(token, this);
  }

  private async resolveProvider<T>(
    provider: interfaces.Provider<T>,
    token: interfaces.Token<T>,
    bindingDictionaryIndex: number
  ): Promise<T> {
    const context = this.createChild(token, bindingDictionaryIndex);
    const value = await provider(context);
    context.request.resolved = value;

    await this.#eventProducer.emitAsync(EventType.Resolve, context);

    return value;
  }

  private createChild<T>(
    token: interfaces.Token<T>,
    bindingDictionaryIndex: number
  ): Context {
    const request = new Request(token);
    const context = new Context(
      this.#bindingDictionaries.slice(bindingDictionaryIndex),
      this.#eventProducer,
      request,
      this
    );

    this.children.add(context);

    return context;
  }

  private findProviderAndBindingDictionaryIndex<T>(
    token: interfaces.Token<T>
  ): [interfaces.Provider<T>, number] {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < this.#bindingDictionaries.length; i++) {
      const provider = this.#bindingDictionaries[i].get(token);
      if (provider !== undefined) return [provider, i];
    }

    throw new CantResolveError(token, this);
  }

  private findProvidersAndBindingDictionaryIndex<T>(
    token: interfaces.Token<T>
  ): [interfaces.Provider<T>[], number][] {
    const result: [interfaces.Provider<T>[], number][] = [];

    this.#bindingDictionaries.forEach((bindingDictionary, i) => {
      const providers = this.#bindingDictionaries[i].getAll(token);
      if (providers.length !== 0) result.push([providers, i]);
    });

    return result;
  }

  emit(event: interfaces.EventToken, ...values: any[]): boolean {
    return this.#eventProducer.emit(event, ...values);
  }

  emitAsync(event: interfaces.EventToken, ...values: any[]): Promise<any[]> {
    return this.#eventProducer.emitAsync(event, ...values);
  }
}

export default Context;
