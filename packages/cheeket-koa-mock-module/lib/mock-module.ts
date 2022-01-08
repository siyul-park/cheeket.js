import { DefaultContext, DefaultState, Middleware } from "koa";
import { ContainerContext } from "cheeket-koa";
import { Container, Register } from "cheeket";
import { InlineModule, Module } from "cheeket-koa-module";

import MockRegister from "./mock-register";

export interface MockModuleOptions {
  override?: boolean;
}
class MockModule<ContextT = DefaultContext> implements Module<ContextT> {
  private readonly internalModule: InlineModule<ContextT>;

  private readonly globalMockRegister = new MockRegister();

  private readonly localMockRegister = new MockRegister();

  constructor(options?: MockModuleOptions) {
    this.internalModule = new InlineModule<ContextT>({
      ...options,
      configure: {
        global: (container) => this.globalMockRegister.apply(container),
        local: (container) => this.localMockRegister.apply(container),
      },
    });

    this.configureGlobal(this.globalMockRegister);
    this.configureGlobal(this.localMockRegister);
  }

  use(...middleware: Middleware<DefaultState, ContextT & ContainerContext>[]): this {
    this.internalModule.use(...middleware);
    return this;
  }

  modules(): Middleware<DefaultState, ContextT & ContainerContext> {
    return this.internalModule.modules();
  }

  isInstalled(container: Container): boolean {
    return this.internalModule.isInstalled(container);
  }

  protected configureGlobal(register: Register): void {}

  protected configureLocal(register: Register): void {}
}

export default MockModule;
