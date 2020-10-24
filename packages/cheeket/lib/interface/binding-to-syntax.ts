import ValueProvider from "./value-provider";
import BindingInAndAsSyntax from "./binding-in-and-as-syntax";

interface BindingToSyntax<T> {
  to(provider: ValueProvider<T>): BindingInAndAsSyntax<T>;
}

export default BindingToSyntax;
