import interfaces from "../interfaces/interfaces";
import Request from "../context/request";
import Context from "../context/context";

class Module implements interfaces.Module {
  readonly #tokens: Set<interfaces.Token<unknown>>;

  readonly #bindingDictionary: interfaces.BindingDictionary;

  readonly #subModules: Set<interfaces.Module>;

  constructor(
    tokens: Set<interfaces.Token<unknown>>,
    bindingDictionary: interfaces.BindingDictionary,
    subModules: Set<interfaces.Module>
  ) {
    this.#tokens = tokens;
    this.#bindingDictionary = bindingDictionary;
    this.#subModules = subModules;
  }

  async get<T>(
    token: interfaces.Token<T>,
    parent: interfaces.Context
  ): Promise<T | undefined> {
    if (!this.isAccessible(token)) {
      return undefined;
    }

    return new Context(
      this.#bindingDictionary,
      this.#subModules,
      new Request(token),
      parent
    ).resolve(token);
  }

  isAccessible<T>(token: interfaces.Token<T>): boolean {
    return (
      this.#tokens.has(token) ||
      Array.from(this.#subModules.values()).some((subModule) =>
        subModule.isAccessible(token)
      )
    );
  }
}

export default Module;
