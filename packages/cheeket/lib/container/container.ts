import Identifier from "../identifier/identifier";
import BinderInterface from "../binding/binder.interface";
import Binder from "../binding/binder";
import BindingToSyntax from "../binding/binding-to-syntax";
import Storage from "../storage/storage";
import AccessLimiter from "../contrant/access-limiter";
import LookUpInterface from "../look-up/look-up.interface";
import AccessLimitedLookUp from "../look-up/access-limited-look-up";

class Container implements LookUpInterface, BinderInterface {
  private readonly storage = new Storage();

  private readonly children = new Set<Container>();

  private readonly privateLookup = new AccessLimitedLookUp(
    this.storage,
    AccessLimiter.Private,
    this.children
  );

  private readonly publicLookup = new AccessLimitedLookUp(
    this.storage,
    AccessLimiter.Public,
    this.children,
    this.privateLookup
  );

  private readonly binder = new Binder(this.storage);

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
    containers.forEach((container) => this.children.add(container));
  }

  unImports<T>(...containers: Container[]): void {
    containers.forEach((container) => this.children.delete(container));
  }
}

export default Container;
