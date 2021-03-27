import { DefaultContext, DefaultState, Middleware } from "koa";
import DependencyInitializer from "./dependency-initializer";
import ContainerContext from "./container-context";

function use<StateT = DefaultState, Context = DefaultContext>(
  dependencyInitializer: DependencyInitializer<Context>,
  middleware: Middleware<StateT, Context & ContainerContext>
): Middleware<StateT, Context & ContainerContext> {
  return async (context, next) => {
    dependencyInitializer.init(context);
    return middleware(context, next);
  };
}

export default use;
