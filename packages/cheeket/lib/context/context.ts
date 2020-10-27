import interfaces from "../interfaces/interfaces";
import Request from "./request";
import CantResolveError from "../error/cant-resolve-error";

class Context implements interfaces.Context {
  readonly #bindingDictionary: interfaces.BindingDictionary;

  readonly #modules: Set<interfaces.Module>;

  readonly id = Symbol("");

  constructor(
    bindingDictionary: interfaces.BindingDictionary,
    modules: Set<interfaces.Module>,
    public request: interfaces.Request<unknown>,
    public parent?: interfaces.Context
  ) {
    this.#bindingDictionary = bindingDictionary;
    this.#modules = modules;
  }

  async resolve<T>(token: interfaces.Token<T>): Promise<T> {
    const provider = this.#bindingDictionary.get(token);
    if (provider !== undefined) {
      this.request = new Request(token);
      return provider(this);
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const module of this.#modules) {
      // eslint-disable-next-line no-await-in-loop
      const value = await module.get(token, this);
      if (value !== undefined) {
        return value;
      }
    }

    throw new CantResolveError(token, this);
  }
}

export default Context;
