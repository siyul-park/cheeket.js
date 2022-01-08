import { DefaultContext, DefaultState, Middleware } from "koa";
import compose from "koa-compose";
import { ContainerContext, dependency } from "cheeket-koa";
import { Container, InternalEvents, Register } from "cheeket";
import { Module } from "cheeket-koa-module";
import MockRegister from "./mock-register";

export interface MockModuleOptions {
  override?: boolean;
}
class MockModule<ContextT = DefaultContext> implements Module<ContextT> {
  private readonly globalContainers = new Set<Container>();

  private readonly localContainers = new Set<Container>();

  private readonly middlewares: Middleware<DefaultState, ContextT & ContainerContext>[] = [];

  private readonly globalMockRegister = new MockRegister();

  private readonly localMockRegister = new MockRegister();

  constructor(private readonly options?: MockModuleOptions) {
    this.configureGlobal(this.globalMockRegister);
    this.configureGlobal(this.localMockRegister);
  }

  use(...middleware: Middleware<DefaultState, ContextT & ContainerContext>[]): this {
    this.middlewares.push(...middleware);
    return this;
  }

  modules(): Middleware<DefaultState, ContextT & ContainerContext> {
    return compose([
      dependency(undefined, { override: this.options?.override ?? false }),
      async (context, next) => {
        this.configureContainer(this.globalContainers, context.containers.global, (container) =>
          this.globalMockRegister.apply(container)
        );
        this.configureContainer(this.localContainers, context.containers.local, (container) =>
          this.localMockRegister.apply(container)
        );

        await next();
      },
      ...this.middlewares,
    ]);
  }

  private configureContainer(
    containers: Set<Container>,
    container: Container,
    configure: (container: Container) => void
  ): void {
    if (!containers.has(container)) {
      containers.add(container);
      const listener = (cleared: unknown) => {
        if (cleared === container) {
          containers.delete(container);
          container.removeListener(InternalEvents.PreClear, listener);
        }
      };
      container.on(InternalEvents.PreClear, listener);
      configure(container);
    }
  }

  isInstalled(container: Container): boolean {
    if (this.globalContainers.has(container)) {
      return true;
    }
    return this.localContainers.has(container);
  }

  protected configureGlobal(register: Register): void {}

  protected configureLocal(register: Register): void {}
}

export default MockModule;
