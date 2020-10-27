import interfaces from "../interfaces/interfaces";
import Request from "./request";
import CantResolveError from "../error/cant-resolve-error";

class Context implements interfaces.Context {
  readonly #bindingDictionary: interfaces.BindingDictionary;

  readonly id = Symbol("");

  public request?: interfaces.Request<unknown> = undefined;

  constructor(bindingDictionary: interfaces.BindingDictionary) {
    this.#bindingDictionary = bindingDictionary;
  }

  async resolve<T>(token: interfaces.Token<T>): Promise<T> {
    const provider = this.#bindingDictionary.get(token);
    if (provider !== undefined) {
      const request = new Request(token);

      request.parent = this.request;
      this.request?.children.add(request);

      const parent = this.request;
      this.request = request;

      const value = await provider(this);

      this.request = parent;

      return value;
    }

    throw new CantResolveError(token, this);
  }
}

export default Context;
