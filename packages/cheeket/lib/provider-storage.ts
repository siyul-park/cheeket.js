import Token from "./token";
import Provider from "./provider";
import Context from "./context";
import Next from "./next";

class ProviderStorage {
  private readonly map = new Map<Token<unknown>, Provider<unknown>[]>();

  private readonly cache = new Map<Token<unknown>, Provider<unknown>>();

  get<T>(token: Token<T>): Provider<T> | undefined {
    const cached = this.cache.get(token);
    if (cached != null) {
      return cached;
    }

    const providers = this.map.get(token) as Provider<T>[] | undefined;
    if (providers == null) {
      return undefined;
    }

    const provider = providers.reduce((pre, cur) => {
      return async (context: Context<T>, next: Next) => {
        await cur(context, async () => {
          await pre(context, next);
        });
      };
    });
    this.cache.set(token, provider as Provider<unknown>);

    return provider;
  }

  set<T>(token: Token<T>, provider: Provider<T>): void {
    const providers = this.map.get(token) ?? [];
    providers.push(provider as Provider<unknown>);

    this.map.set(token, providers);
    this.cache.delete(token);
  }

  delete<T>(token: Token<T>, provider?: Provider<T>): void {
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

  has<T>(token: Token<T>, provider?: Provider<T>): boolean {
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

export default ProviderStorage;
