import Token from "./token";
import Middleware from "./middleware";
import compose from "./middleware/compose";

class MiddlewareStorage {
  private readonly map = new Map<Token<unknown>, Middleware<unknown>[]>();

  private readonly cache = new Map<Token<unknown>, Middleware<unknown>>();

  get<T>(token: Token<T>): Middleware<T> | undefined {
    const cached = this.cache.get(token);
    if (cached != null) {
      return cached;
    }

    const providers = this.map.get(token) as Middleware<T>[] | undefined;
    if (providers == null) {
      return undefined;
    }

    const provider = compose(providers);
    this.cache.set(token, provider as Middleware<unknown>);

    return provider;
  }

  set<T>(token: Token<T>, provider: Middleware<T>): void {
    const providers = this.map.get(token) ?? [];
    providers.push(provider as Middleware<unknown>);

    this.map.set(token, providers);
    this.cache.delete(token);
  }

  delete<T>(token: Token<T>, provider?: Middleware<T>): void {
    if (provider == null) {
      this.map.delete(token);
      this.cache.delete(token);
    } else {
      const providers = this.map.get(token);
      if (providers == null) {
        return;
      }

      const index = providers.findIndex((cur) => cur === provider);
      if (index > -1) {
        providers.splice(index, 1);
        if (providers.length === 0) {
          this.map.delete(token);
        }
        this.cache.delete(token);
      }
    }
  }

  has<T>(token: Token<T>, provider?: Middleware<T>): boolean {
    if (provider == null) {
      return this.map.has(token);
    }
    const providers = this.map.get(token);
    if (providers == null) {
      return false;
    }

    return providers.findIndex((cur) => cur === provider) > -1;
  }

  keys(): Token<unknown>[] {
    return Array.from(this.map.keys());
  }
}

export default MiddlewareStorage;
