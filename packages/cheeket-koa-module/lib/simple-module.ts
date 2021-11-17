import { DefaultContext, DefaultState, Middleware } from "koa";
import { ContainerContext } from "cheeket-koa";
import { Container } from "cheeket";
import Module from "./module";

abstract class SimpleModule<ContextT = DefaultContext> implements Module<ContextT> {
  private readonly globalContainers = new Set<Container>();

  protected abstract configureGlobal(container: Container): void;

  protected abstract configureLocal(container: Container): void;

  modules(): Middleware<DefaultState, ContextT & ContainerContext> {
    return async (context, next) => {
      if (!this.globalContainers.has(context.containers.global)) {
        this.globalContainers.add(context.containers.global);
        this.configureGlobal(context.containers.global);
      }

      this.configureLocal(context.containers.local);

      await next();
    };
  }
}

export default SimpleModule;
