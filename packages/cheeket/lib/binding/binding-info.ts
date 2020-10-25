import Identifier from "../identifier/identifier";
import Lifecycle from "../contrant/lifecycle";
import AccessLimiter from "../contrant/access-limiter";
import ValueProvider from "./value-provider";

interface BindingInfo<T> {
  id: Identifier<T>;
  lifecycle: Lifecycle;
  accessLimiter: AccessLimiter;
  valueProvider?: ValueProvider<T>;
  value?: T;
}

export default BindingInfo;
