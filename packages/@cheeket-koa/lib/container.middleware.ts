import Application, { DefaultState } from "koa";
import { Container } from "cheeket";

import Handlers from "./handlers";
import ContainerContext from "./container-context";
import * as Token from "./token";

function container(
  handlers: Handlers
): Application.Middleware<DefaultState, Partial<ContainerContext>> {
  const globalContainer = new Container();
  handlers.global.init(globalContainer);

  let applyOnClose = false;
  return async (ctx, next) => {
    if (!applyOnClose) {
      ctx.app.on("close", () => handlers.global.close(globalContainer));
      applyOnClose = true;
    }

    const localContainer = globalContainer.createChildContainer();
    handlers.local.init(localContainer);

    localContainer.bind(Token.Context, () => ctx);
    localContainer.bind(Token.Request, () => ctx.request);
    localContainer.bind(Token.Response, () => ctx.response);
    localContainer.bind(Token.Req, () => ctx.req);
    localContainer.bind(Token.Res, () => ctx.res);
    localContainer.bind(Token.OriginalUrl, () => ctx.origin);
    localContainer.bind(Token.Cookies, () => ctx.cookies);
    localContainer.bind(Token.Accepts, () => ctx.accept);
    localContainer.bind(Token.Respond, () => ctx.respond);

    ctx.containers = {
      local: localContainer,
      global: globalContainer,
    };

    ctx.resolve = (token) => localContainer.resolve(token);
    ctx.resolveAll = (token) => localContainer.resolveAll(token);

    await next();
    handlers.local.close(localContainer);
  };
}

export default container;
