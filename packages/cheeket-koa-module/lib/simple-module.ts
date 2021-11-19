import { DefaultContext, DefaultState, Middleware } from "koa";
import { ContainerContext } from "cheeket-koa";
import { Container, InternalEvents } from "cheeket";
import Module from "./module";
import compose from "koa-compose";

class SimpleModule<ContextT = DefaultContext> implements Module<ContextT> {
  private readonly globalContainers = new Set<Container>();

  private readonly middlewares: Middleware<DefaultState, ContextT & ContainerContext>[] = [];

  use(...middleware: Middleware<DefaultState, ContextT & ContainerContext>[]): this {
    this.middlewares.push(...middleware);
    return this;
  }

  protected configureGlobal(container: Container): void {}

  protected configureLocal(container: Container): void {}

  modules(): Middleware<DefaultState, ContextT & ContainerContext> {
    return compose([
      async (context, next) => {
        if (!this.globalContainers.has(context.containers.global)) {
          this.globalContainers.add(context.containers.global);
          context.containers.global.on(InternalEvents.Clear, () => {
            this.globalContainers.delete(context.containers.global);
          });
          this.configureGlobal(context.containers.global);
        }

        this.configureLocal(context.containers.local);

        await next();
      },
      ...this.middlewares,
    ]);
  }
}

export default SimpleModule;
