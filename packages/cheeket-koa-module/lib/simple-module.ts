/* eslint-disable @typescript-eslint/no-unused-vars */

import { DefaultContext, DefaultState, Middleware } from "koa";
import compose from "koa-compose";
import { ContainerContext, dependency } from "cheeket-koa";
import { Container, InternalEvents } from "cheeket";

import Module from "./module";

export interface SimpleModuleOptions {
  override?: boolean;
}
class SimpleModule<ContextT = DefaultContext> implements Module<ContextT> {
  private readonly globalContainers = new Set<Container>();

  private readonly localContainers = new Set<Container>();

  private readonly middlewares: Middleware<DefaultState, ContextT & ContainerContext>[] = [];

  constructor(private readonly options?: SimpleModuleOptions) {}

  use(...middleware: Middleware<DefaultState, ContextT & ContainerContext>[]): this {
    this.middlewares.push(...middleware);
    return this;
  }

  isInstalled(container: Container): boolean {
    if (this.globalContainers.has(container)) {
      return true;
    }
    return this.localContainers.has(container);
  }

  modules(): Middleware<DefaultState, ContextT & ContainerContext> {
    return compose([
      dependency(undefined, { override: this.options?.override ?? false }),
      async (context, next) => {
        this.configureContainer(this.globalContainers, context.containers.global, (container) =>
          this.configureGlobal(container)
        );
        this.configureContainer(this.localContainers, context.containers.local, (container) =>
          this.configureLocal(container)
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

  protected configureGlobal(container: Container): void {}

  protected configureLocal(container: Container): void {}
}

export default SimpleModule;
