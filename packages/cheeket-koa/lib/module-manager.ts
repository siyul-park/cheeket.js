import Application from "koa";
import { Container } from "cheeket";

import Module from "./module";

class ModuleManager {
  private readonly registered: Module[] = [];

  modules(...modules: Module[]): this {
    this.registered.push(...modules);
    return this;
  }

  install<StateT = Application.DefaultState, ContextT = Application.DefaultContext>(
    application: Application<StateT, ContextT>
  ): Container {
    const container = new Container();

    this.registered.forEach((module) => {
      module.configureGlobal(container);
    });

    application.use(async (context, next) => {
      const child = container.createChild();

      this.registered.forEach((module) => {
        module.configureRequest(child);
      });

      await next();
    });

    return container;
  }
}

export default ModuleManager;
