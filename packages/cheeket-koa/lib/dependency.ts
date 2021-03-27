import Application, { DefaultContext, DefaultState } from "koa";
import { interfaces } from "cheeket";

import ContainerContext from "./container-context";
import * as Token from "./token";

function dependency<
  StateT = DefaultState,
  ContextT = DefaultContext,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ResponseBodyT = any
>(
  rootContainer: interfaces.Container,
  options?: interfaces.ContainerConstructorOptions
): Application.Middleware<
  StateT,
  ContextT & Partial<ContainerContext>,
  ResponseBodyT
> {
  return async (ctx, next) => {
    const contextContainer = rootContainer.createChildContainer(options);

    contextContainer.bind(Token.Context, () => ctx);
    contextContainer.bind(Token.Application, () => ctx.app);
    contextContainer.bind(Token.Request, () => ctx.request);
    contextContainer.bind(Token.Response, () => ctx.response);
    contextContainer.bind(Token.Req, () => ctx.req);
    contextContainer.bind(Token.Res, () => ctx.res);
    contextContainer.bind(Token.OriginalUrl, () => ctx.origin);
    contextContainer.bind(Token.Cookies, () => ctx.cookies);
    contextContainer.bind(Token.Accepts, () => ctx.accept);
    contextContainer.bind(Token.Respond, () => ctx.respond);

    ctx.containers = {
      root: rootContainer,
      context: contextContainer,
    };

    ctx.resolve = (token) => contextContainer.resolve(token);
    ctx.resolveAll = (token) => contextContainer.resolveAll(token);

    try {
      await next();
    } finally {
      await contextContainer.clear();
    }
  };
}

export default dependency;
