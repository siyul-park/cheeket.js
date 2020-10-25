import Identifier from "../identifier/identifier";
import AccessLimiter from "../contrant/access-limiter";
import ValueProvider from "../provider/value-provider";

interface BindingInfo<T> {
  id: Identifier<T>;
  accessLimiter: AccessLimiter;
  valueProvider?: ValueProvider<T>;
}

export default BindingInfo;