import BindingToSyntaxInterface from "../interface/binding-to-syntax";
import BindingInAndAsSyntaxInterface from "../interface/binding-in-and-as-syntax";

import ValueProvider from "../interface/value-provider";
import Binding from "../interface/binding";
import BindingInAndAsSyntax from "./binding-in-and-as-syntax";

class BindingToSyntax<T> implements BindingToSyntaxInterface<T> {
  constructor(private readonly binding: Binding<T>) {}

  to(provider: ValueProvider<T>): BindingInAndAsSyntaxInterface<T> {
    this.binding.valueProvider = provider;
    return new BindingInAndAsSyntax(this.binding);
  }
}

export default BindingToSyntax;
