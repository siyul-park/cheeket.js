import LookUp from "./look-up.interface";
import Identifier from "../identifier/identifier";
import AccessLimiter from "../contrant/access-limiter";
import FetchError from "./fetch-error";
import Storage from "../storage/storage";
import isCanAccess from "./is-can-access";

class AccessLimitedLookUp implements LookUp {
  private readonly binderLookup: LookUp;

  constructor(
    private readonly storage: Storage,
    private readonly accessLimiter: AccessLimiter,
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
    const binding = this.storage.get(id);
    if (
      binding === undefined ||
      !isCanAccess(binding.accessLimiter, this.accessLimiter)
    ) {
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

export default AccessLimitedLookUp;
