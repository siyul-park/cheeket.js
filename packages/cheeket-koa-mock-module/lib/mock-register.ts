import { Container, MiddlewareStorage, Middleware, Register, Token, route } from "cheeket";

class MockRegister implements Register {
  private readonly storage = new MiddlewareStorage();

  private readonly interceptor = route(this.storage);

  register<T>(token: Token<T>, middleware: Middleware<T>): this {
    if (!this.isRegister(token, middleware)) {
      this.storage.set(token, middleware);
    }
    return this;
  }

  unregister<T>(token: Token<T>, middleware?: Middleware<T>): this {
    this.storage.delete(token, middleware);
    return this;
  }

  isRegister<T>(token: Token<T>, middleware?: Middleware<T>): boolean {
    return this.storage.has(token, middleware);
  }

  apply(container: Container): void {
    container.use(this.interceptor);
  }
}

export default MockRegister;
