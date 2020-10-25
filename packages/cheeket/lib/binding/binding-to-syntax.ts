import Binding from "./binding";
import ValueProvider from "../provider/value-provider";
import BindingInSyntax from "./binding-in-syntax";

class BindingToSyntax<T> {
  constructor(private readonly binding: Binding<T>) {}

  to(provider: ValueProvider<T>): BindingInSyntax<T> {
    this.binding.valueProvider = provider;
    return new BindingInSyntax(this.binding);
  }
}

export default BindingToSyntax;
