import ServiceIdentifier from "./service-identifier";
import AccessLimiter from "./access-limiter";
import Binding from "./binding";

interface Storage {
  add<T>(binding: Binding<T>): void;

  get<T>(
    id: ServiceIdentifier<T>,
    accessLimiter: AccessLimiter
  ): Promise<Binding<T> | undefined>;

  getValue<T>(
    id: ServiceIdentifier<T>,
    accessLimiter: AccessLimiter
  ): Promise<T | undefined>;
}

export default Storage;
