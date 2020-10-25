import LookUp from "../look-up/look-up.interface";
import Identifier from "../identifier/identifier";
import AccessLimiter from "../access-limiter/access-limiter";
import ValueProvider from "../provider/value-provider";
import BindingInfo from "./binding-info";

class Binding<T> {
  id: Identifier<T>;

  accessLimiter: AccessLimiter;

  valueProvider?: ValueProvider<T>;

  constructor(bindingInfo: BindingInfo<T>) {
    this.id = bindingInfo.id;
    this.accessLimiter = bindingInfo.accessLimiter;
    this.valueProvider = bindingInfo.valueProvider;
  }

  async resolve(lookUp: LookUp): Promise<T> {
    if (this.valueProvider === undefined) {
      throw new Error("ValueProvider is not undefined");
    }

    return this.valueProvider(lookUp);
  }
}

export default Binding;
