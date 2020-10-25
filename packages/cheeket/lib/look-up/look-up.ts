import LookUpInterface from "./look-up.interface";
import Identifier from "../identifier/identifier";
import FetchError from "./fetch-error";
import StorageReader from "../storage/storage-reader";

class LookUp implements LookUpInterface {
  private readonly binderLookup: LookUp;

  constructor(
    private readonly storageReader: StorageReader,
    binderLookup?: LookUp
  ) {
    if (binderLookup === undefined) {
      this.binderLookup = this;
    } else {
      this.binderLookup = binderLookup;
    }
  }

  async resolveOrThrow<T>(id: Identifier<T>): Promise<T> {
    const value = await this.resolve(id);
    if (value === undefined) {
      throw new FetchError(`${id.toString()} is not found`);
    }

    return value;
  }

  async resolve<T>(id: Identifier<T>): Promise<T | undefined> {
    const binding = this.storageReader.get(id);
    if (binding === undefined) {
      return undefined;
    }

    try {
      const value = await binding.resolve(this.binderLookup);
      if (value !== undefined) {
        return value;
      }
    } catch (e) {
      if (!(e instanceof FetchError)) {
        throw e;
      }
    }

    return undefined;
  }
}

export default LookUp;
