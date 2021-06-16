import { Container, DefaultState } from "cheeket";
import Module from "./module";

class SimpleModule<RootState = DefaultState, ContextState = DefaultState>
  implements Module<RootState, ContextState> {
  // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-unused-vars
  configureRoot(container: Container<RootState>): void {}

  // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-unused-vars
  configureContext(container: Container<ContextState>): void {}
}

export default SimpleModule;
