import interfaces from "../interfaces/interfaces";

class BindingDictionary implements interfaces.BindingDictionary {
  readonly #storage = new Map<
    interfaces.Token<unknown>,
    interfaces.Provider<unknown>
  >();

  get<T>(token: interfaces.Token<T>): interfaces.Provider<T> | undefined {
    return this.#storage.get(token) as interfaces.Provider<T> | undefined;
  }

  set<T>(token: interfaces.Token<T>, provider: interfaces.Provider<T>): void {
    this.#storage.set(token, provider as interfaces.Provider<unknown>);
  }
}

export default BindingDictionary;
