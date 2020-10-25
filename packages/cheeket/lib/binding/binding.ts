import LookUp from "../look-up/look-up";
import Identifier from "../identifier/identifier";
import Provider from "../provider/provider";
import BindingInfo from "./binding-info";

class Binding<T> {
  id: Identifier<T>;

  provider: Provider<T>;

  constructor(bindingInfo: BindingInfo<T>) {
    this.id = bindingInfo.id;
    this.provider = bindingInfo.provider;
  }

  async resolve(lookUp: LookUp): Promise<T> {
    return this.provider(lookUp);
  }
}

export default Binding;
