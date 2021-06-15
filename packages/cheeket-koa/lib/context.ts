import { Container, DefaultState, Resolver } from "cheeket";

interface Context<RootState = DefaultState, ContextState = DefaultState>
  extends Resolver {
  containers: {
    root: Container<RootState>;
    context: Container<ContextState>;
  };
}

export default Context;
