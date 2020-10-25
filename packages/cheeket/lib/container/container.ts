import Identifier from "../identifier/identifier";
import BinderInterface from "../binding/binder.interface";
import Binder from "../binding/binder";
import BindingToSyntax from "../binding/binding-to-syntax";
import Storage from "../storage/storage";
import AccessLimiter from "../contrant/access-limiter";
import LookUp from "../look-up/look-up";
import AccessLimitedLookUp from "../look-up/access-limited-look-up";

class Container implements LookUp, BinderInterface {
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

  async getOrThrow<T>(id: Identifier<T>): Promise<T> {
    return this.publicLookup.getOrThrow(id);
  }

  async get<T>(id: Identifier<T>): Promise<T | undefined> {
    return this.publicLookup.get(id);
  }

  imports<T>(...containers: Container[]): void {
    containers.forEach((container) => this.children.add(container));
  }

  unImports<T>(...containers: Container[]): void {
    containers.forEach((container) => this.children.delete(container));
  }
}

export default Container;
