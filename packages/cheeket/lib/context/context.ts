import uniqid from "uniqid";
import * as interfaces from "../interfaces";
import Request from "./request";
import CantResolveError from "../error/cant-resolve-error";
import { EventType } from "../event";

class Context implements interfaces.Context {
  readonly id = Symbol(uniqid());

  readonly #containerContexts: interfaces.ContainerContext[];

  public readonly container: interfaces.EventEmitter;

  public readonly children = new Set<interfaces.Context>();

  constructor(
    containerContexts: interfaces.ContainerContext[],
    public request: interfaces.Request<unknown>,
    public parent?: interfaces.Context
  ) {
    this.#containerContexts = containerContexts;

    const current = containerContexts[0];
    if (current === undefined) {
      throw new Error("There must be at least one container.");
    }
    this.container = current.eventEmitter;
  }

  async resolve<T>(token: interfaces.Token<T>): Promise<T> {
    const [provider, containerIndex] = this.findProviderAndContainerIndex(
      token
    );
    return this.resolveProvider(provider, token, containerIndex);
  }

  async resolveAll<T>(token: interfaces.Token<T>): Promise<T[]> {
    const providersAndIndexList = this.findProvidersAndContainerIndexList(
      token
    );
    if (providersAndIndexList.length > 0) {
      return Promise.all(
        providersAndIndexList
          .map(([providers, containerIndex]) =>
            providers.map((provider) =>
              this.resolveProvider(provider, token, containerIndex)
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
    containerIndex: number
  ): Promise<T> {
    const context = this.createChild(token, containerIndex);
    const value = await provider(context);
    context.request.resolved = value;

    await this.#containerContexts[containerIndex].eventEmitter.emitAsync(
      EventType.Resolve,
      context
    );

    return value;
  }

  private createChild<T>(
    token: interfaces.Token<T>,
    containerIndex: number
  ): Context {
    const request = new Request(token);
    const context = new Context(
      this.#containerContexts.slice(containerIndex),
      request,
      this
    );

    this.children.add(context);

    return context;
  }

  private findProviderAndContainerIndex<T>(
    token: interfaces.Token<T>
  ): [interfaces.Provider<T>, number] {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < this.#containerContexts.length; i++) {
      const provider = this.#containerContexts[i].bindingDictionary.get(token);
      if (provider !== undefined) return [provider, i];
    }

    throw new CantResolveError(token, this);
  }

  private findProvidersAndContainerIndexList<T>(
    token: interfaces.Token<T>
  ): [interfaces.Provider<T>[], number][] {
    const result: [interfaces.Provider<T>[], number][] = [];

    this.#containerContexts.forEach((containerContexts, i) => {
      const providers = this.#containerContexts[i].bindingDictionary.getAll(
        token
      );
      if (providers.length !== 0) result.push([providers, i]);
    });

    return result;
  }
}

export default Context;
