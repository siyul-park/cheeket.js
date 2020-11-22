import * as interfaces from "../interfaces";

class MutableBindingDictionary implements interfaces.MutableBindingDictionary {
  readonly #storage = new Map<
    interfaces.Token<unknown>,
    interfaces.Provider<unknown>[]
  >();

  set<T>(token: interfaces.Token<T>, provider: interfaces.Provider<T>): void {
    const existed = this.#storage.get(token) ?? [];
    existed.push(provider);
    this.#storage.set(token, existed);
  }

  get<T>(token: interfaces.Token<T>): interfaces.Provider<T> | undefined {
    const existed = this.#storage.get(token);
    if (existed === undefined) {
      return undefined;
    }
    return existed[existed.length - 1] as interfaces.Provider<T> | undefined;
  }

  getAll<T>(token: interfaces.Token<T>): interfaces.Provider<T>[] {
    return (this.#storage.get(token) ?? []) as interfaces.Provider<T>[];
  }

  delete<T>(token: interfaces.Token<T>): void {
    this.#storage.delete(token);
  }

  has<T>(token: interfaces.Token<T>): boolean {
    const existed = this.#storage.get(token);
    return existed !== undefined && existed.length > 0;
  }
}

export default MutableBindingDictionary;
