import * as interfaces from "../interfaces";
import Request from "./request";
import CantResolveError from "../error/cant-resolve-error";

class Context implements interfaces.Context {
  readonly #bindingDictionary: interfaces.BindingDictionary;

  constructor(
    readonly id: symbol,
    bindingDictionary: interfaces.BindingDictionary,
    public request: interfaces.Request<unknown>
  ) {
    this.#bindingDictionary = bindingDictionary;
  }

  async resolve<T>(token: interfaces.Token<T>): Promise<T> {
    const provider = this.#bindingDictionary.get(token);
    if (provider !== undefined) {
      const request = new Request(token);

      request.parent = this.request;
      this.request.children.add(request);

      return provider(new Context(this.id, this.#bindingDictionary, request));
    }

    throw new CantResolveError(token, this);
  }
}

export default Context;
