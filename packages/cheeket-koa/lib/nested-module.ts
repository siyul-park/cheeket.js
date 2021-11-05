import { Container, Token } from "cheeket";
import Module from "./module";

abstract class NestedModule implements Module {
  readonly children: Token<Module>[] = [];

  configureGlobal(container: Container): void {}

  configureLocal(container: Container): void {}

  install(module: Token<Module>): this {
    this.children.push(module);
    return this;
  }
}

export default NestedModule;
