import Binder from "./binder";
import Binding from "./binding";
import Identifier from "../identifier/identifier";
import Storage from "../storage/storage";
import Provider from "../provider/provider";

class BinderImpl implements Binder {
  constructor(private readonly storage: Storage) {}

  bind<T>(id: Identifier<T>, provider: Provider<T>): void {
    const binding = new Binding<T>({
      id,
      provider,
    });
    this.storage.add(binding);
  }

  unbind<T>(id: Identifier<T>): void {
    this.storage.remove(id);
  }
}

export default BinderImpl;
