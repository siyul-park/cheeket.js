import Identifier from "../identifier/identifier";
import BinderInterface from "../binding/binder.interface";
import Binder from "../binding/binder";
import BindingToSyntax from "../binding/binding-to-syntax";
import Storage from "../storage/storage";
import LookUpInterface from "../look-up/look-up.interface";
import LookUp from "../look-up/look-up";

class Container implements LookUpInterface, BinderInterface {
  readonly #storage = new Storage();

  private readonly privateLookup = new LookUp(this.#storage);

  private readonly publicLookup = new LookUp(
    this.#storage.getPublicReader(),
    this.privateLookup
  );

  private readonly binder = new Binder(this.#storage);

  bind<T>(id: Identifier<T>): BindingToSyntax<T> {
    return this.binder.bind(id);
  }

  unbind<T>(id: Identifier<T>): void {
    return this.binder.unbind(id);
  }

  async resolveOrThrow<T>(id: Identifier<T>): Promise<T> {
    return this.publicLookup.resolveOrThrow(id);
  }

  async resolve<T>(id: Identifier<T>): Promise<T | undefined> {
    return this.publicLookup.resolve(id);
  }

  imports<T>(...containers: Container[]): void {
    containers.forEach((container) => this.#storage.concat(container.#storage));
  }
}

export default Container;
