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
    AccessLimiter.Private
  );

  private readonly publicLookup = new AccessLimitedLookUp(
    this.storage,
    AccessLimiter.Public,
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

  async get<T>(id: ServiceIdentifier<T>): Promise<T | undefined> {
    const value = this.publicLookup.get(id);
    if (value !== undefined) {
      return value;
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const child of this.children) {
      // eslint-disable-next-line no-await-in-loop
      const childValue = await child.get(id);
      if (childValue !== undefined) {
        return childValue;
      }
    }
    return undefined;
  }

  addChild<T>(container: ContainerInterface): void {
    if (this.children.has(container)) {
      return;
    }

    this.children.add(container);
  }
}

export default Container;
