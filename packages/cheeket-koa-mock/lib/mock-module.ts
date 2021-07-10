import { Binder, DefaultState } from "cheeket";

interface MockModule<RootState = DefaultState, ContextState = DefaultState> {
  configureRoot(binder: Binder<RootState>): void;
  configureContext(binder: Binder<ContextState>): void;
}

export default MockModule;
