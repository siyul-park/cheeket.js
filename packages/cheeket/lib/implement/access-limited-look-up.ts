import LookUp from "../interface/look-up";
import Storage from "../interface/storage";
import ServiceIdentifier from "../interface/service-identifier";
import AccessLimiter from "../interface/access-limiter";
import FetchError from "./fetch-error";

class AccessLimitedLookUp implements LookUp {
  private readonly lookup: LookUp;

  constructor(
    private readonly storage: Storage,
    private readonly accessLimiter: AccessLimiter,
    private readonly children: Set<LookUp>,
    lookup?: LookUp
  ) {
    if (lookup === undefined) {
      this.lookup = this;
    } else {
      this.lookup = lookup;
    }
  }

  async fetch<T>(id: ServiceIdentifier<T>): Promise<T> {
    const value = await this.get(id);
    if (value === undefined) {
      throw new FetchError(`${id.toString()} is not found`);
    }

    return value;
  }

  async get<T>(id: ServiceIdentifier<T>): Promise<T | undefined> {
    const binding = this.storage.get(id, this.accessLimiter);
    if (binding !== undefined) {
      try {
        const value = await binding.resolve(this.lookup);
        if (value !== undefined) {
          return value;
        }
      } catch (e) {
        if (!(e instanceof FetchError)) {
          throw e;
        }
      }
    }

    return this.getByChildren(id);
  }

  private async getByChildren<T>(
    id: ServiceIdentifier<T>
  ): Promise<T | undefined> {
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
