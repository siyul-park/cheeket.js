import Application, { DefaultContext, DefaultState } from "koa";
import { Container, interfaces } from "cheeket";

import ContainerContext from "./container-context";
import * as Token from "./token";
import Initializer from "./initializer";

function container<
  StateT = DefaultState,
  ContextT = DefaultContext,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ResponseBodyT = any
>(
  initializer: Initializer,
  options?: interfaces.EventEmitterOptions
): Application.Middleware<
  StateT,
  ContextT & Partial<ContainerContext>,
  ResponseBodyT
> {
  const rootContainer = new Container(options);
  initializer.initRootContainer(rootContainer);

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

    initializer.initContextContainer(contextContainer, ctx);

    ctx.containers = {
      root: rootContainer,
      context: contextContainer,
    };

    ctx.resolve = (token) => contextContainer.resolve(token);
    ctx.resolveAll = (token) => contextContainer.resolveAll(token);

    await next();
    await contextContainer.clear();
  };
}

export default container;
