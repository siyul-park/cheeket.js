import interfaces from "../interfaces/interfaces";
import Context from "../context/context";
import BindingDictionary from "../binding/binding-dictionary";
import Request from "../context/request";
import CantResolveError from "../error/cant-resolve-error";

class Container implements interfaces.Container {
  readonly #bindingDictionary: interfaces.BindingDictionary = new BindingDictionary();

  bind<T>(token: interfaces.Token<T>, provider: interfaces.Provider<T>): void {
    this.#bindingDictionary.set(token, provider);
  }

  async resolve<T>(token: interfaces.Token<T>): Promise<T> {
    const provider = this.#bindingDictionary.get(token);
    if (provider !== undefined) {
      return provider(
        new Context(Symbol(""), this.#bindingDictionary, new Request(token))
      );
    }

    throw new CantResolveError(token, this);
  }
}

export default Container;
