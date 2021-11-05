import { DefaultContext, DefaultState, Middleware } from "koa";
import ContainerContext from "./container-context";
import { Container } from "cheeket";

function container<StateT = DefaultState, ContextT = DefaultContext, ResponseBodyT = any>(
  global: Container = new Container()
): Middleware<StateT, ContextT & ContainerContext, ResponseBodyT> {
  return async (context, next) => {
    const local = global.createChild();

    await next();
  };
}

export default container();
