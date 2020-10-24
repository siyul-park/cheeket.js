import BindingInAndAsSyntaxInterface, {
  BindingAsSyntax,
  BindingInSyntax,
} from "../interface/binding-in-and-as-syntax";
import Binding from "../interface/binding";
import Lifecycle from "../interface/lifecycle";
import AccessLimiter from "../interface/access-limiter";

class BindingInAndAsSyntax<T> implements BindingInAndAsSyntaxInterface<T> {
  constructor(private readonly binding: Binding<T>) {}

  inRequest(): BindingAsSyntax<T> {
    return this.in(Lifecycle.Request);
  }

  inSingleton(): BindingAsSyntax<T> {
    return this.in(Lifecycle.Singleton);
  }

  in(lifecycle: Lifecycle): BindingAsSyntax<T> {
    this.binding.lifecycle = lifecycle;
    return this;
  }

  asPrivate(): BindingInSyntax<T> {
    return this.as(AccessLimiter.Private);
  }

  asPublic(): BindingInSyntax<T> {
    return this.as(AccessLimiter.Public);
  }

  as(accessLimiter: AccessLimiter): BindingInSyntax<T> {
    this.binding.accessLimiter = accessLimiter;
    return this;
  }
}

export default BindingInAndAsSyntax;
