import Token from "./token";
import Provider from "./provider";

interface Register {
  register<T>(token: Token<T>, provider: Provider<T>): this;

  unregister<T>(token: Token<T>, provider: Provider<T>): this;
  unregister<T>(token: Token<T>): this;

  isRegister<T>(token: Token<T>, provider: Provider<T>): boolean;
  isRegister<T>(token: Token<T>): boolean;
}

export default Register;
