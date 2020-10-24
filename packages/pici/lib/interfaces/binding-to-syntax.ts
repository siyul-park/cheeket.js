import ValueProvider from "./value-provider";
import BindingInSyntax from "./binding-in-syntax";

interface BindingToSyntax<T> {
  to(provider: ValueProvider<T>): BindingInSyntax<T>;
}

export default BindingToSyntax;
