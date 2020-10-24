import LookUp from "./look-up";
import BindingInfo from "./binding-info";

interface Binding<T> extends BindingInfo<T> {
  resolve(lookUp: LookUp): Promise<T>;
}

export default Binding;
