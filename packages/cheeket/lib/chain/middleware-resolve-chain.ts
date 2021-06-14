import EventEmitter from "events";

import { Token } from "../token";
import { Middleware } from "../middleware";
import { Context } from "../context";
import ContextAdapter from "./context-adapter";
import ResolveChain from "./resolve-chain";
import ResolveError from "./resolve-error";

class MiddlewareResolveChain implements ResolveChain {
  constructor(
    readonly middlewareProvider: () => Middleware<unknown, unknown>,
    private readonly container: EventEmitter,
    private readonly next?: ResolveChain
  ) {}

  async resolve<T>(
    token: Token<T>,
    parent?: Context<unknown, unknown>
  ): Promise<T> {
    const context = new ContextAdapter(this, this.container, token, parent);
    const middleware = this.middlewareProvider();

    await middleware(context, async () => {
      if (this.next == null || context.response != null) {
        return;
      }
      context.response = await this.next.resolve(token, context);
    });

    if (context.response != null) {
      return context.response;
    }

    throw new ResolveError(token);
  }
}

export default MiddlewareResolveChain;
