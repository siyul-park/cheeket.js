import ContainerInterface from "../interface/container";
import BindingToSyntaxInterface from "../interface/binding-to-syntax";
import ServiceIdentifier from "../interface/service-identifier";

import Storage from "./storage";
import Binding from "./binding";
import Lifecycle from "../interface/lifecycle";
import AccessLimiter from "../interface/access-limiter";
import BindingToSyntax from "./binding-to-syntax";
import AccessLimitedLookUp from "./access-limited-look-up";

class Container implements ContainerInterface {
  private readonly storage = new Storage();

  private readonly children = new Set<ContainerInterface>();

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

  bind<T>(id: ServiceIdentifier<T>): BindingToSyntaxInterface<T> {
    const binding = new Binding<T>({
      id,
      lifecycle: Lifecycle.Singleton,
      accessLimiter: AccessLimiter.Public,
    });
    this.storage.add(binding);

    return new BindingToSyntax(binding);
  }

  unbind<T>(id: ServiceIdentifier<T>): void {
    this.storage.remove(id);
  }

  async fetch<T>(id: ServiceIdentifier<T>): Promise<T> {
    return this.publicLookup.fetch(id);
  }

  async get<T>(id: ServiceIdentifier<T>): Promise<T | undefined> {
    return this.publicLookup.get(id);
  }

  async resolveAll(): Promise<void> {
    const bindings = this.storage.getAll();
    await Promise.all(
      bindings
        .filter((binding) => binding.lifecycle === Lifecycle.Singleton)
        .map((binding) => binding.resolve(this.privateLookup))
    );

    await Promise.all(
      Array.from(this.children.values()).map((child) => child.resolveAll())
    );
  }

  imports<T>(...containers: Container[]): void {
    containers.forEach((container) => this.children.add(container));
  }
}

export default Container;
