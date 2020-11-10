import Provider from "./provider";
import Token from "./token";

interface Binder {
  bind<T>(token: Token<T>, provider: Provider<T>): void;
  rebind<T>(token: Token<T>, provider: Provider<T>): void;
  unbind<T>(token: Token<T>): void;
  isBound<T>(token: Token<T>): boolean;
}

export default Binder;
