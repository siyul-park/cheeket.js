import { DefaultContext, DefaultState, Middleware } from "koa";
import { ContainerContext } from "cheeket-koa";

interface Module<ContextT = DefaultContext> {
  modules(): Middleware<DefaultState, ContextT & ContainerContext>;
}

export default Module;
