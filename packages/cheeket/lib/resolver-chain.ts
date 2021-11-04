import Resolver from "./resolver";
import Token from "./token";
import Storage from "./storage";
import Context from "./context";

class ResolverChain implements Resolver {
  constructor(
    private readonly storage: Storage,
    private readonly next?: ResolverChain
  ) {}

  async resolve<T>(
    token: Token<T>,
    parent?: Context<unknown>
  ): Promise<T | undefined> {
    const context = this.createContext(token, parent);
    const provider = this.storage.get(token);

    await provider?.(context);
    if (provider == null || context.response === undefined) {
      return this?.next?.resolve(token, context);
    }

    return context.response;
  }

  private createContext<T>(
    token: Token<T>,
    parent?: Context<unknown>
  ): Context<T> {
    const context: Context<T> = {
      request: token,
      response: undefined,
      parent,
      children: [] as Context<unknown>[],

      // eslint-disable-next-line @typescript-eslint/no-shadow
      resolve: <U>(token: Token<U>) => {
        return this.resolve(token, context);
      },
    };
    parent?.children?.push(context);

    return context;
  }
}

export default ResolverChain;
