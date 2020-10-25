import LookUpInterface from "../look-up/look-up";
import Lifecycle from "../contrant/lifecycle";
import Identifier from "../identifier/identifier";
import AccessLimiter from "../contrant/access-limiter";
import ValueProvider from "./value-provider";
import BindingInfo from "./binding-info";

class Binding<T> {
  id: Identifier<T>;

  lifecycle: Lifecycle;

  accessLimiter: AccessLimiter;

  valueProvider?: ValueProvider<T>;

  value?: T;

  constructor(bindingInfo: BindingInfo<T>) {
    this.id = bindingInfo.id;
    this.lifecycle = bindingInfo.lifecycle;
    this.accessLimiter = bindingInfo.accessLimiter;
    this.valueProvider = bindingInfo.valueProvider;
    this.value = bindingInfo.value;
  }

  async resolve(lookUp: LookUpInterface): Promise<T> {
    if (this.valueProvider === undefined) {
      throw new Error("ValueProvider is not undefined");
    }

    if (this.lifecycle === Lifecycle.Singleton) {
      if (this.value !== undefined) {
        return this.value;
      }

      const value = await this.valueProvider(lookUp);
      this.value = value;
      return value;
    }

    return this.valueProvider(lookUp);
  }
}

export default Binding;
