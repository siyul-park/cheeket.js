import ServiceIdentifier from "./service-identifier";
import AccessLimiter from "./access-limiter";
import Binding from "./binding";

interface Storage {
  add<T>(binding: Binding<T>): void;

  get<T>(
    id: ServiceIdentifier<T>,
    accessLimiter: AccessLimiter
  ): Binding<T> | undefined;

  remove<T>(id: ServiceIdentifier<T>): void;
}

export default Storage;
