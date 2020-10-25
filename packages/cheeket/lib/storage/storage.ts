import Identifier from "../identifier/identifier";
import Binding from "../binding/binding";

class Storage {
  private readonly bindings = new Map<Identifier<unknown>, Binding<unknown>>();

  add<T>(binding: Binding<T>): void {
    this.bindings.set(binding.id, binding);
  }

  get<T>(id: Identifier<T>): Binding<T> | undefined {
    return this.bindings.get(id) as Binding<T> | undefined;
  }

  remove<T>(id: Identifier<T>): void {
    this.bindings.delete(id);
  }
}

export default Storage;
