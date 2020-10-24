import AccessLimiter from "./access-limiter";
import Lifecycle from "./lifecycle";

export interface BindingAsSyntax<T> {
  as(accessLimiter: AccessLimiter): BindingInSyntax<T>;
  asPublic(): BindingInSyntax<T>;
  asPrivate(): BindingInSyntax<T>;
}

export interface BindingInSyntax<T> {
  in(lifecycle: Lifecycle): BindingAsSyntax<T>;
  inSingleton(): BindingAsSyntax<T>;
  inRequest(): BindingAsSyntax<T>;
}

interface BindingInAndAsSyntax<T>
  extends BindingInSyntax<T>,
    BindingAsSyntax<T> {}

export default BindingInAndAsSyntax;
