import { Binder, DefaultState } from "cheeket";

import MockModule from "./mock-module";

class SimpleMockModule<RootState = DefaultState, ContextState = DefaultState>
  implements MockModule<RootState, ContextState>
{
  // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-unused-vars
  configureRoot(binder: Binder<RootState>): void {}

  // eslint-disable-next-line class-methods-use-this,@typescript-eslint/no-unused-vars
  configureContext(binder: Binder<ContextState>): void {}
}

export default SimpleMockModule;
