import interfaces from "../interfaces/interfaces";
import Context from "../context/context";
import BindingDictionary from "../binding/binding-dictionary";
import Request from "../context/request";
import Module from "../module/module";

class Container implements interfaces.Container {
  readonly #modules = new Set<interfaces.Module>();

  readonly #bindingDictionary: interfaces.BindingDictionary = new BindingDictionary();

  bind<T>(token: interfaces.Token<T>, provider: interfaces.Provider<T>): void {
    this.#bindingDictionary.set(token, provider);
  }

  resolve<T>(token: interfaces.Token<T>): Promise<T> {
    return new Context(
      this.#bindingDictionary,
      this.#modules,
      new Request(token)
    ).resolve(token);
  }

  import(module: interfaces.Module): void {
    this.#modules.add(module);
  }

  export(tokens: interfaces.Token<unknown>[]): interfaces.Module {
    return new Module(new Set(tokens), this.#bindingDictionary, this.#modules);
  }
}

export default Container;
