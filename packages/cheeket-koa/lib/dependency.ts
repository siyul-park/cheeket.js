/* eslint-disable @typescript-eslint/no-shadow,@typescript-eslint/no-explicit-any */

import Koa, { Context, DefaultContext, DefaultState, Middleware } from "koa";
import { Container, Middleware as CMiddleware } from "cheeket";

import ContainerContext from "./container-context";
import InternalTokens from "./internal-tokens";
import Token from "cheeket/dist/token";

function dependency<StateT = DefaultState, ContextT = DefaultContext, ResponseBodyT = any>(
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

    context.resolve = (token) => {
      return context.containers.local.resolve(token);
    };
    context.resolveOrDefault = (token, other) => {
      return context.containers.local.resolveOrDefault(token, other);
    };

    context.register = (token, middleware) => {
      return context.containers.local.register(token, middleware);
    };
    context.unregister = <T>(token: Token<T>, middleware?: CMiddleware<T>) => {
      return context.containers.local.unregister(token, middleware);
    };
    context.isRegister = <T>(token: Token<T>, middleware?: CMiddleware<T>) => {
      return context.containers.local.isRegister(token, middleware);
    };

    try {
      await next();
    } finally {
      local.clear();
    }
  };
}

export default dependency;
