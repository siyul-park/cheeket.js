import AccessLimiter from "../contrant/access-limiter";
import Binding from "./binding";

class BindingInSyntax<T> {
  constructor(private readonly binding: Binding<T>) {}

  inPrivate(): void {
    return this.in(AccessLimiter.Private);
  }

  inPublic(): void {
    return this.in(AccessLimiter.Public);
  }

  in(accessLimiter: AccessLimiter): void {
    this.binding.accessLimiter = accessLimiter;
  }
}

export default BindingInSyntax;
