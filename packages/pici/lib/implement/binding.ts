import BindingInterface from "../interface/binding";
import LookUpInterface from "../interface/look-up";
import Lifecycle from "../interface/lifecycle";
import ServiceIdentifier from "../interface/service-identifier";
import AccessLimiter from "../interface/access-limiter";
import ValueProvider from "../interface/value-provider";
import BindingInfo from "../interface/binding-info";

class Binding<T> implements BindingInterface<T> {
  id: ServiceIdentifier<T>;

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
    if (this.value !== undefined) {
      return this.value;
    }
    if (this.valueProvider === undefined) {
      throw new Error("ValueProvider is not undefined");
    }

    const value = await this.valueProvider(lookUp);
    this.value = value;
    return value;
  }
}

export default Binding;
