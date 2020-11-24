import Application, { DefaultState } from "koa";
import { Container } from "cheeket";

import Handlers from "./handlers";
import ContainerContext from "./container-context";
import * as Token from "./token";

function container(
  handlers: Handlers
): Application.Middleware<DefaultState, Partial<ContainerContext>> {
  const rootContainer = new Container();
  handlers.root.init(rootContainer);

  return async (ctx, next) => {
    const contextContainer = rootContainer.createChildContainer();

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

    handlers.context.init(contextContainer);

    ctx.containers = {
      root: rootContainer,
      context: contextContainer,
    };

    ctx.resolve = (token) => contextContainer.resolve(token);
    ctx.resolveAll = (token) => contextContainer.resolveAll(token);

    await next();
    handlers.context.close(contextContainer);
  };
}

export default container;
