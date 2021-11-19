import { DefaultContext, DefaultState, Middleware } from "koa";
import { ContainerContext } from "cheeket-koa";
import { Container } from "cheeket";
import Module from "./module";
import compose from "koa-compose";

abstract class SimpleModule<ContextT = DefaultContext> implements Module<ContextT> {
  private readonly globalContainers = new Set<Container>();

  private readonly middlewares: Middleware<DefaultState, ContextT>[] = [];

  use(...middleware: Middleware<DefaultState, ContextT>[]): this {
    this.middlewares.push(...middleware);
    return this;
  }

  protected abstract configureGlobal(container: Container): void;

  protected abstract configureLocal(container: Container): void;

  modules(): Middleware<DefaultState, ContextT & ContainerContext> {
    return compose([
      async (context, next) => {
        if (!this.globalContainers.has(context.containers.global)) {
          this.globalContainers.add(context.containers.global);
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
