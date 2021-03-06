import { interfaces } from "cheeket";
import { DefaultContext, DefaultState, ParameterizedContext } from "koa";

interface Initializer<
  StateT = DefaultState,
  ContextT = DefaultContext,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ResponseBodyT = any
> {
  initRootContainer(container: interfaces.Container): void;
  initContextContainer(
    container: interfaces.Container,
    context: ParameterizedContext<StateT, ContextT, ResponseBodyT>
  ): void;
}

export default Initializer;
