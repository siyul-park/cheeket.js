import Provider from "./provider";
import Token from "./token";

interface Binder {
  bind<T>(token: Token<T>, provider: Provider<T>): void;
}

export default Binder;
