import Token from "./token";
import Middleware from "./middleware";

interface Register {
  use(...middlewares: Middleware<unknown>[]): this;

  register<T>(token: Token<T>, middleware: Middleware<T>): this;

  unregister<T>(token: Token<T>, middleware: Middleware<T>): this;
  unregister<T>(token: Token<T>): this;

  isRegister<T>(token: Token<T>, middleware: Middleware<T>): boolean;
  isRegister<T>(token: Token<T>): boolean;
}

export default Register;
