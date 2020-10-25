import AccessLimiter from "../contrant/access-limiter";
import Lifecycle from "../contrant/lifecycle";
import Binding from "./binding";

export interface BindingInSyntax<T> {
  in(accessLimiter: AccessLimiter): BindingForSyntax<T>;
  inPublic(): BindingForSyntax<T>;
  inPrivate(): BindingForSyntax<T>;
}

export interface BindingForSyntax<T> {
  for(lifecycle: Lifecycle): BindingInSyntax<T>;
  forSingleton(): BindingInSyntax<T>;
  forRequest(): BindingInSyntax<T>;
}

class BindingInAndForSyntax<T>
  implements BindingInSyntax<T>, BindingForSyntax<T> {
  constructor(private readonly binding: Binding<T>) {}

  forRequest(): BindingInSyntax<T> {
    return this.for(Lifecycle.Request);
  }

  forSingleton(): BindingInSyntax<T> {
    return this.for(Lifecycle.Singleton);
  }

  for(lifecycle: Lifecycle): BindingInSyntax<T> {
    this.binding.lifecycle = lifecycle;
    return this;
  }

  inPrivate(): BindingForSyntax<T> {
    return this.in(AccessLimiter.Private);
  }

  inPublic(): BindingForSyntax<T> {
    return this.in(AccessLimiter.Public);
  }

  in(accessLimiter: AccessLimiter): BindingForSyntax<T> {
    this.binding.accessLimiter = accessLimiter;
    return this;
  }
}

export default BindingInAndForSyntax;
