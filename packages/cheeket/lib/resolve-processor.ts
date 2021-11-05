/* eslint-disable @typescript-eslint/no-shadow */

import Resolver from "./resolver";
import Token from "./token";
import ProviderStorage from "./provider-storage";
import Context from "./context";
import ResolveError from "./resolve-error";
import composeProvider from "./compose-provider";
import InternalTokens from "./internal-tokens";
import Provider from "./provider";

class ResolveProcessor implements Resolver {
  constructor(private readonly storage: ProviderStorage) {}

  async resolveOrDefault<T, D>(
    token: Token<T>,
    other: D,
    parent?: Context<unknown>
  ): Promise<T | D> {
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

    const preProcess = this.storage.get(InternalTokens.PreProcess);
    const provider = this.storage.get(token) as Provider<unknown> | undefined;
    const postProcess = this.storage.get(InternalTokens.PostProcess);

    const finalProvider = composeProvider(
      [preProcess, provider, postProcess],
      (context) => {
        return context.response === undefined;
      }
    );

    await finalProvider?.(context, async () => {});

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
