/* eslint-disable @typescript-eslint/no-shadow */

import Resolver from "./resolver";
import Token from "./token";
import Context from "./context";
import ResolveError from "./resolve-error";
import Middleware from "./middleware";

class ResolveProcessor implements Resolver {
  constructor(private readonly middleware: Middleware<unknown>) {}

  async resolveOrDefault<T, D>(token: Token<T>, other: D, parent?: Context<unknown>): Promise<T | D> {
    try {
      return await this.resolve(token, parent);
    } catch (e) {
      if (e instanceof ResolveError) {
        return other;
      }
      throw e;
    }
  }

  async resolve<T>(token: Token<T>, parent?: Context<unknown>): Promise<T> {
    const context = this.createContext(token, parent);

    await this.middleware(context, async () => {});

    if (context.response === undefined) {
      throw new ResolveError(`Can't resolve ${context.request.toString()}`);
    }
    return context.response;
  }

  private createContext<T>(token: Token<T>, parent?: Context<unknown>): Context<T> {
    const context: Context<T> = {
      request: token,
      response: undefined,
      parent,
      children: [] as Context<unknown>[],

      resolveOrDefault: <U, D>(token: Token<U>, other: D) => {
        return this.resolveOrDefault(token, other, context);
      },
      resolve: <U>(token: Token<U>) => {
        return this.resolve(token, context);
      },
    };
    parent?.children?.push(context);

    return context;
  }
}

export default ResolveProcessor;
