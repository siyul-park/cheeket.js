import Identifier from "../identifier/identifier";
import BindingToSyntax from "./binding-to-syntax";

interface Binder {
  bind<T>(id: Identifier<T>): BindingToSyntax<T>;

  unbind<T>(id: Identifier<T>): void;
}

export default Binder;
