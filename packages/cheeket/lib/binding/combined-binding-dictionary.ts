import * as interfaces from "../interfaces";

class CombinedBindingDictionary implements interfaces.BindingDictionary {
  readonly #bindingDictionaries: interfaces.BindingDictionary[] = [];

  constructor(bindingDictionaries: interfaces.BindingDictionary[]) {
    this.#bindingDictionaries = bindingDictionaries;
  }

  get<T>(token: interfaces.Token<T>): interfaces.Provider<T> | undefined {
    // eslint-disable-next-line no-restricted-syntax
    for (const bindingDictionary of this.#bindingDictionaries) {
      const provider = bindingDictionary.get(token);
      if (provider !== undefined) return provider;
    }

    return undefined;
  }

  getAll<T>(token: interfaces.Token<T>): interfaces.Provider<T>[] {
    const providers: interfaces.Provider<T>[] = [];

    this.#bindingDictionaries.forEach((bindingDictionary) => {
      providers.push(...bindingDictionary.getAll(token));
    });

    return providers;
  }

  has<T>(token: interfaces.Token<T>): boolean {
    return this.#bindingDictionaries.some((bindingDictionary) =>
      bindingDictionary.has(token)
    );
  }
}

export default CombinedBindingDictionary;
