import Resolver from "./resolver";
import Token from "./token";
import ProviderStorage from "./provider-storage";
import Context from "./context";
import ResolveError from "./resolve-error";

class ResolveChain implements Resolver {
  constructor(
    private readonly storage: ProviderStorage,
    private readonly next?: ResolveChain
  ) {}

  async resolve<T>(token: Token<T>, parent?: Context<unknown>): Promise<T> {
    const context = this.createContext(token, parent);
    const provider = this.storage.get(token);

    if (provider == null) {
      const response = this?.next?.resolve(token, context);
      if (response === undefined) {
        throw new ResolveError(`Can't resolve ${context.request.toString()}`);
      }
      return response;
    }

    await provider(context, async () => {
      if (context.response === undefined) {
        context.response = await this?.next?.resolve(token, context);
      }
    });

    if (context.response === undefined) {
      throw new ResolveError(`Can't resolve ${context.request.toString()}`);
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

export default ResolveChain;
