import { EventEmitter2 } from "eventemitter2";

import * as interfaces from "../interfaces";
import Context from "../context/context";
import BindingDictionary from "../binding/binding-dictionary";
import Request from "../context/request";
import CantResolveError from "../error/cant-resolve-error";
import { Event } from "../event";

class Container extends EventEmitter2 implements interfaces.Container {
  readonly #bindingDictionary: interfaces.BindingDictionary = new BindingDictionary();

  bind<T>(token: interfaces.Token<T>, provider: interfaces.Provider<T>): void {
    this.#bindingDictionary.set(token, provider);
  }

  async resolve<T>(token: interfaces.Token<T>): Promise<T> {
    const provider = this.#bindingDictionary.get(token);
    if (provider !== undefined) {
      const request = new Request(token);
      const context = new Context(this.#bindingDictionary, this, request);

      const value = await provider(context);
      request.resolved = value;

      await this.emitAsync(Event.Resolve, context);

      return value;
    }

    throw new CantResolveError(token, this);
  }
}

export default Container;
