/* eslint-disable @typescript-eslint/no-shadow */

import Koa, { Context, DefaultContext, DefaultState, Middleware } from "koa";
import { AsyncLock, Container, Middleware as CMiddleware } from "cheeket";

import ContainerContext from "./container-context";
import InternalTokens from "./internal-tokens";
import Application from "koa";
import InternalEvents from "./internal-events";
import Module from "./module";

function container<StateT = DefaultState, ContextT = DefaultContext, ResponseBodyT = any>(
  module: Module
): Middleware<StateT, ContextT & ContainerContext, ResponseBodyT> {
  const initializedApplication = new Set<Application>();
  const lock = new AsyncLock();

  const global = new Container();

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

    if (!initializedApplication.has(context.app)) {
      await lock.acquire(context.app, async () => {
        if (initializedApplication.has(context.app)) {
          return;
        }
        initializedApplication.add(context.app);

        await module.configureGlobal(global);

        global.emit(InternalEvents.Load, global);
        await global.emitAsync(InternalEvents.LoadAsync, global);
      });
    }

    await module.configureLocal(local);

    local.emit(InternalEvents.Load, local);
    await local.emitAsync(InternalEvents.LoadAsync, local);

    try {
      await next();
    } finally {
      local.clear();
    }
  };
}

export default container;
