/* eslint-disable @typescript-eslint/no-unused-vars */

import { DefaultContext, DefaultState, Middleware } from 'koa';
import { ContainerContext } from 'cheeket-koa';
import { Container, Register } from 'cheeket';
import { InlineModule, Module } from 'cheeket-koa-module';
import Mocker from 'cheeket-mock';

export interface MockModuleOptions {
  override?: boolean;
}
class MockModule<ContextT = DefaultContext> implements Module<ContextT> {
  private init = false;

  private readonly internalModule: InlineModule<ContextT>;

  private readonly globalMocker = new Mocker();

  private readonly localMocker = new Mocker();

  constructor(options?: MockModuleOptions) {
    this.internalModule = new InlineModule<ContextT>({
      ...options,
      configure: {
        global: (container) => container.use(this.globalMocker.mock()),
        local: (container) => container.use(this.localMocker.mock()),
      },
    });
  }

  use(...middleware: Middleware<DefaultState, ContextT & ContainerContext>[]): this {
    this.internalModule.use(...middleware);
    return this;
  }

  modules(): Middleware<DefaultState, ContextT & ContainerContext> {
    if (!this.init) {
      this.configureGlobal(this.globalMocker);
      this.configureLocal(this.localMocker);
      this.init = true;
    }
    return this.internalModule.modules();
  }

  isInstalled(container: Container): boolean {
    return this.internalModule.isInstalled(container);
  }

  protected configureGlobal(register: Register): void {}

  protected configureLocal(register: Register): void {}
}

export default MockModule;
