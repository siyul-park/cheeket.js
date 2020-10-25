import BinderInterface from "./binder.interface";
import Binding from "./binding";
import BindingToSyntax from "./binding-to-syntax";
import Identifier from "../identifier/identifier";
import Storage from "../storage/storage";
import AccessLimiter from "../access-limiter/access-limiter";

class Binder implements BinderInterface {
  constructor(private readonly storage: Storage) {}

  bind<T>(id: Identifier<T>): BindingToSyntax<T> {
    const binding = new Binding<T>({
      id,
      accessLimiter: AccessLimiter.Public,
    });
    this.storage.add(binding);

    return new BindingToSyntax(binding);
  }

  unbind<T>(id: Identifier<T>): void {
    this.storage.remove(id);
  }
}

export default Binder;
