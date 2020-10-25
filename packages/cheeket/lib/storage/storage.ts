import Identifier from "../identifier/identifier";
import Binding from "../binding/binding";
import StorageReader from "./storage-reader";
import PublicStorageReader from "./public-storage-reader";

class Storage implements StorageReader {
  private readonly bindings = new Map<Identifier<unknown>, Binding<unknown>>();

  private readonly subStorageReaders = new Set<StorageReader>();

  add<T>(binding: Binding<T>): void {
    this.bindings.set(binding.id, binding);
  }

  get<T>(id: Identifier<T>): Binding<T> | undefined {
    const value = this.bindings.get(id) as Binding<T> | undefined;
    if (value !== undefined) {
      return value;
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const subStorageReader of this.subStorageReaders) {
      const subValue = subStorageReader.get(id);
      if (subValue !== undefined) {
        return subValue;
      }
    }

    return undefined;
  }

  getPublicReader(): StorageReader {
    return new PublicStorageReader(this);
  }

  remove<T>(id: Identifier<T>): void {
    this.bindings.delete(id);
  }

  concat(other: StorageReader): void {
    this.subStorageReaders.add(other);
  }
}

export default Storage;
