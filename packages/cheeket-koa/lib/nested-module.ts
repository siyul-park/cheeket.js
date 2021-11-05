import { Container, Middleware, Token } from "cheeket";
import Module from "./module";

abstract class NestedModule implements Module {
  private readonly dependencyTokens: Token<Module>[] = [];

  private readonly children: [Token<Module>, Middleware<Module>][] = [];

  async configureGlobal(container: Container): Promise<void> {
    this.children.forEach(([token, middleware]) => {
      container.register(token, middleware);
    });

    const children = await Promise.all(this.dependencyTokens.map((it) => container.resolve(it)));
    children.forEach((it) => {
      it.configureGlobal(container);
    });
  }

  async configureLocal(container: Container): Promise<void> {
    const children = await Promise.all(this.dependencyTokens.map((it) => container.resolve(it)));
    children.forEach((it) => {
      it.configureLocal(container);
    });
  }

  protected register<T extends Module>(module: Token<T>, middleware: Middleware<T>): this {
    this.dependency(module);
    this.children.push([module, middleware as Middleware<Module>]);
    return this;
  }

  protected dependency(module: Token<Module>): this {
    this.dependencyTokens.push(module);
    return this;
  }
}

export default NestedModule;
