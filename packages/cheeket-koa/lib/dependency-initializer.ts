import { DefaultContext, DefaultState, ParameterizedContext } from "koa";
import ContainerContext from "./container-context";

interface DependencyInitializer<Context = DefaultContext> {
  init(
    context: ParameterizedContext<DefaultState, Context & ContainerContext>
  ): void;
}

export default DependencyInitializer;
