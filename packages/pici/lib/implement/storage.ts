import StorageInterface from "../interface/storage";
import Binding from "../interface/binding";
import ServiceIdentifier from "../interface/service-identifier";
import AccessLimiter from "../interface/access-limiter";
import isCanAccess from "../util/is-can-access";

class Storage implements StorageInterface {
  private readonly bindings = new Map<
    ServiceIdentifier<unknown>,
    Binding<unknown>
  >();

  add<T>(binding: Binding<T>): void {
    this.bindings.set(binding.id, binding);
  }

  get<T>(
    id: ServiceIdentifier<T>,
    accessLimiter: AccessLimiter
  ): Binding<T> | undefined {
    const binding = this.bindings.get(id);
    if (
      binding === undefined ||
      !isCanAccess(binding.accessLimiter, accessLimiter)
    ) {
      return undefined;
    }

    return binding as Binding<T>;
  }

  remove<T>(id: ServiceIdentifier<T>): void {
    this.bindings.delete(id);
  }
}

export default Storage;
