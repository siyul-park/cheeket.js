import Identifier from "../identifier/identifier";
import Provider from "../provider/provider";

interface BindingInfo<T> {
  id: Identifier<T>;
  provider: Provider<T>;
}

export default BindingInfo;
