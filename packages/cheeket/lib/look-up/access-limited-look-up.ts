import LookUp from "./look-up";
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
    private readonly children: Set<LookUp>,
    binderLookup?: LookUp
  ) {
    if (binderLookup === undefined) {
      this.binderLookup = this;
    } else {
      this.binderLookup = binderLookup;
    }
  }

  async getOrThrow<T>(id: Identifier<T>): Promise<T> {
    const value = await this.get(id);
    if (value === undefined) {
      throw new FetchError(`${id.toString()} is not found`);
    }

    return value;
  }

  async get<T>(id: Identifier<T>): Promise<T | undefined> {
    const value = await this.getByCurrent(id);
    if (value !== undefined) {
      return value;
    }
    return this.getByChildren(id);
  }

  private async getByCurrent<T>(id: Identifier<T>): Promise<T | undefined> {
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

  private async getByChildren<T>(id: Identifier<T>): Promise<T | undefined> {
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
}

export default AccessLimitedLookUp;
