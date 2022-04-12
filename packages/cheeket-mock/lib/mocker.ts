import { MiddlewareStorage, Middleware, Register, Token, route } from 'cheeket';

class Mocker implements Register {
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

  mock(): Middleware<unknown> {
    return this.interceptor;
  }
}

export default Mocker;
