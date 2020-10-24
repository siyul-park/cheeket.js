import Lifecycle from "./lifecycle";
import BindingAsSyntax from "./binding-as-syntax";

interface BindingInSyntax<T> {
  in(lifecycle: Lifecycle): BindingAsSyntax<T>;
  inSingleton(): BindingAsSyntax<T>;
  inRequest(): BindingAsSyntax<T>;
}

export default BindingInSyntax;
