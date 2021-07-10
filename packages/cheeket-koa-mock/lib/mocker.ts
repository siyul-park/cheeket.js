import { Binder, DefaultState } from "cheeket";

import MockModule from "./mock-module";

class Mocker<RootState = DefaultState, ContextState = DefaultState>
  implements MockModule<RootState, ContextState>
{
  private readonly modules: MockModule<RootState, ContextState>[] = [];

  install(module: MockModule<RootState, ContextState>): void {
    this.modules.push(module);
  }

  configureRoot(binder: Binder<RootState>): void {
    this.modules.forEach((module) => {
      module.configureRoot(binder);
    });
  }

  configureContext(binder: Binder<ContextState>): void {
    this.modules.forEach((module) => {
      module.configureContext(binder);
    });
  }
}

export default Mocker;
