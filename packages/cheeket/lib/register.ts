import Token from './token';
import Middleware from './middleware/middleware';

interface Register {
  register<T>(token: Token<T>, middleware: Middleware<T>): Register;

  unregister<T>(token: Token<T>, middleware: Middleware<T>): Register;
  unregister<T>(token: Token<T>): Register;

  isRegister<T>(token: Token<T>, middleware: Middleware<T>): boolean;
  isRegister<T>(token: Token<T>): boolean;
}

export default Register;
