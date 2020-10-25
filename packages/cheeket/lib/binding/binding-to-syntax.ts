import Binding from "./binding";
import ValueProvider from "./value-provider";
import BindingInAndForSyntax from "./binding-in-and-for-syntax";

class BindingToSyntax<T> {
  constructor(private readonly binding: Binding<T>) {}

  to(provider: ValueProvider<T>): BindingInAndForSyntax<T> {
    this.binding.valueProvider = provider;
    return new BindingInAndForSyntax(this.binding);
  }
}

export default BindingToSyntax;
