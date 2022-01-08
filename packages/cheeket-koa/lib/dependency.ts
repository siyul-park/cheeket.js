/* eslint-disable @typescript-eslint/no-shadow,@typescript-eslint/no-explicit-any */

import Koa, { Context, DefaultContext, DefaultState, Middleware } from "koa";
import { Container, Middleware as CMiddleware, Token } from "cheeket";

import ContainerContext from "./container-context";
import InternalTokens from "./internal-tokens";
import Cookies from "cookies";

export interface DependencyOptions {
  override?: boolean;
}

function dependency<StateT = DefaultState, ContextT = DefaultContext, ResponseBodyT = any>(
  global?: Container,
  options?: DependencyOptions
): Middleware<StateT, ContextT & ContainerContext, ResponseBodyT> {
  function bind<T>(value: T): CMiddleware<T> {
    return async (context, next) => {
      context.response = value;
      await next();
    };
  }

  let cachedGlobal: Container | undefined;
  const override = options?.override ?? false;

  function getCachedGlobal(): Container {
    if (cachedGlobal != null) {
      return cachedGlobal;
    }
    cachedGlobal = new Container();
    return cachedGlobal;
  }

  return async (context, next) => {
    const originContainers = context.containers;

    if (!override && originContainers?.global != null && originContainers?.local != null) {
      await next();
      return;
    }

    const localGlobal = override
      ? global ?? getCachedGlobal() ?? originContainers?.global
      : originContainers?.global ?? global ?? getCachedGlobal();
    const local =
      !override && localGlobal === originContainers?.global && originContainers?.local != null
        ? originContainers.local
        : localGlobal.createChild();

    if (local !== originContainers?.local) {
      local.register(InternalTokens.Context, bind<Context>(context));
      local.register(InternalTokens.Application, bind(context.app));
      local.register(InternalTokens.Request, bind(context.request));
      local.register(InternalTokens.Response, bind<Koa.Response>(context.response));
      local.register(InternalTokens.Req, bind(context.req));
      local.register(InternalTokens.Res, bind(context.res));
      local.register(InternalTokens.OriginalUrl, bind(context.originalUrl));
      local.register(InternalTokens.Cookies, bind<Cookies.ICookies>(context.cookies));
      local.register(InternalTokens.Accepts, bind(context.accept));
      local.register(InternalTokens.Respond, bind(context.respond));
    }

    context.containers = {
      global: localGlobal,
      local,
    };

    if (originContainers == null) {
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
    }

    try {
      await next();
    } finally {
      if (local !== originContainers?.local) {
        local.clear();
      }

      if (originContainers != null) {
        context.containers = originContainers;
      } else {
        (context as Partial<ContextT & ContainerContext>).containers = undefined;
        (context as Partial<ContextT & ContainerContext>).resolve = undefined;
        (context as Partial<ContextT & ContainerContext>).resolveOrDefault = undefined;
        (context as Partial<ContextT & ContainerContext>).register = undefined;
        (context as Partial<ContextT & ContainerContext>).unregister = undefined;
        (context as Partial<ContextT & ContainerContext>).isRegister = undefined;
      }
    }
  };
}

export default dependency;
