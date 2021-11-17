import { DefaultContext, DefaultState, Middleware } from "koa";
import { ContainerContext } from "cheeket-koa";
import InternalTokens from "./internal-tokens";

function modules<StateT = DefaultState, ContextT = DefaultContext, ResponseBodyT = any>(): Middleware<
  StateT,
  ContextT & ContainerContext,
  ResponseBodyT
> {
  return async (context, next) => {
    const localModules = await context.resolve(InternalTokens.LocalModules);
    localModules.forEach((module) => {
      module.configure(context.containers.local);
    });
    await next();
  };
}

export default modules;
