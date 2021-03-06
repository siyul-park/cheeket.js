import { interfaces } from "cheeket";
import { DefaultContext, DefaultState, ParameterizedContext } from "koa";

interface Initializer<
  StateT = DefaultState,
  ContextT = DefaultContext,
  ResponseBodyT = never
> {
  initRootContainer(container: interfaces.Container): void;
  initContextContainer(
    container: interfaces.Container,
    context: ParameterizedContext<StateT, ContextT, ResponseBodyT>
  ): void;
}

export default Initializer;
