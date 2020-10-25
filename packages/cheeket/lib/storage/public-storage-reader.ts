import Identifier from "../identifier/identifier";
import Binding from "../binding/binding";
import StorageReader from "./storage-reader";
import isCanAccess from "../access-limiter/is-can-access";
import AccessLimiter from "../access-limiter/access-limiter";

class PublicStorageReader implements StorageReader {
  constructor(private readonly storageReader: StorageReader) {}

  get<T>(id: Identifier<T>): Binding<T> | undefined {
    const value = this.storageReader.get(id);
    if (
      value === undefined ||
      !isCanAccess(value.accessLimiter, AccessLimiter.Public)
    ) {
      return undefined;
    }

    return value;
  }
}

export default PublicStorageReader;
