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

    const provider = providers.reduceRight((pre, cur) => {
      return async (context: Context<T>, next: Next) => {
        cur(context, async () => {
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
}

export default ProviderStorage;
