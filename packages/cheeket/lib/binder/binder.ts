import { Token } from "../token";
import Middleware from "../middleware/middleware";
import DefaultState from "../context/default-state";

interface Binder<State = DefaultState> {
  bind<T>(token: Token<T>, middleware: Middleware<T, State>): void;
  unbind<T>(token: Token<T>, middleware?: Middleware<T, State>): void;

  isBound<T>(token: Token<T>, middleware?: Middleware<T, State>): boolean;
}

export default Binder;
