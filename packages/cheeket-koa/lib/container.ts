/* eslint-disable @typescript-eslint/no-shadow */

import Koa, { Context, DefaultContext, DefaultState, Middleware } from "koa";
import { Container, Middleware as CMiddleware } from "cheeket";

import ContainerContext from "./container-context";
import InternalTokens from "./internal-tokens";

function container<StateT = DefaultState, ContextT = DefaultContext, ResponseBodyT = any>(
  global: Container = new Container()
): Middleware<StateT, ContextT & ContainerContext, ResponseBodyT> {
  function bind<T>(value: T): CMiddleware<T> {
    return async (context, next) => {
      context.response = value;
      await next();
    };
  }

  return async (context, next) => {
    const local = global.createChild();

    local.register(InternalTokens.Context, bind<Context>(context));
    local.register(InternalTokens.Application, bind(context.app));
    local.register(InternalTokens.Request, bind(context.request));
    local.register(InternalTokens.Response, bind<Koa.Response>(context.response));
    local.register(InternalTokens.Req, bind(context.req));
    local.register(InternalTokens.Res, bind(context.res));
    local.register(InternalTokens.OriginalUrl, bind(context.originalUrl));
    local.register(InternalTokens.Cookies, bind(context.cookies));
    local.register(InternalTokens.Accepts, bind(context.accept));
    local.register(InternalTokens.Respond, bind(context.respond));

    context.containers = {
      global,
      local,
    };

    context.resolve = (token) => local.resolve(token);
    context.resolveOrDefault = (token, other) => local.resolveOrDefault(token, other);

    try {
      await next();
    } finally {
      local.clear();
    }
  };
}

export default container;
