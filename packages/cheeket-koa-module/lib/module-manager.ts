import { Container } from "cheeket";
import Module from "./module";

class ModuleManager implements Module {
  private readonly modules: Module[] = [];

  register(module: Module): this {
    this.modules.push(module);
    return this;
  }

  configure(container: Container): void {
    this.modules.forEach((module) => module.configure(container));
  }
}

export default ModuleManager;
