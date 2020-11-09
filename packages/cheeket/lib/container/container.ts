import { EventEmitter2 } from "eventemitter2";

import * as interfaces from "../interfaces";
import Context from "../context/context";
import BindingDictionary from "../binding/binding-dictionary";
import Request from "../context/request";
import CantResolveError from "../error/cant-resolve-error";
import { EventType } from "../event";

class Container extends EventEmitter2 implements interfaces.Container {
  readonly #bindingDictionary: interfaces.BindingDictionary = new BindingDictionary();

  bind<T>(token: interfaces.Token<T>, provider: interfaces.Provider<T>): void {
    this.#bindingDictionary.set(token, provider);
  }

  isBound<T>(token: interfaces.Token<T>): boolean {
    return this.#bindingDictionary.has(token);
  }

  rebind<T>(
    token: interfaces.Token<T>,
    provider: interfaces.Provider<T>
  ): void {
    this.#bindingDictionary.delete(token);
    this.#bindingDictionary.set(token, provider);
  }

  unbind<T>(token: interfaces.Token<T>): void {
    this.#bindingDictionary.delete(token);
  }

  async resolve<T>(token: interfaces.Token<T>): Promise<T> {
    const provider = this.#bindingDictionary.get(token);
    if (provider !== undefined) {
      const request = new Request(token);
      const context = new Context(this.#bindingDictionary, this, request);

      const value = await provider(context);
      request.resolved = value;

      await this.emitAsync(EventType.Resolve, context);

      return value;
    }

    throw new CantResolveError(token, this);
  }

  async resolveAll<T>(token: interfaces.Token<T>): Promise<T[]> {
    const providers = this.#bindingDictionary.getAll(token);
    if (providers.length > 0) {
      const request = new Request(token);
      const context = new Context(this.#bindingDictionary, this, request);

      const value = await Promise.all(
        providers.map((provider) => provider(context))
      );
      request.resolved = value;

      await this.emitAsync(EventType.Resolve, context);

      return value;
    }

    throw new CantResolveError(token, this);
  }
}

export default Container;
