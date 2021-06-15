import { Container, DefaultState } from "cheeket";

interface Module<RootState = DefaultState, ContextState = DefaultState> {
  configureRoot(container: Container<RootState>): void;
  configureContext(container: Container<ContextState>): void;
}

export default Module;
