import interfaces from "../interfaces/interfaces";
import Context from "../context/context";
import BindingDictionary from "../binding/binding-dictionary";

class Container implements interfaces.Container {
  readonly #bindingDictionary: interfaces.BindingDictionary = new BindingDictionary();

  bind<T>(token: interfaces.Token<T>, provider: interfaces.Provider<T>): void {
    this.#bindingDictionary.set(token, provider);
  }

  resolve<T>(token: interfaces.Token<T>): Promise<T> {
    return new Context(this.#bindingDictionary).resolve(token);
  }
}

export default Container;
