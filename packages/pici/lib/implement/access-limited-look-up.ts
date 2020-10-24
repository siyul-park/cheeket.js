import LookUp from "../interface/look-up";
import Storage from "../interface/storage";
import ServiceIdentifier from "../interface/service-identifier";
import AccessLimiter from "../interface/access-limiter";

class AccessLimitedLookUp implements LookUp {
  private readonly lookup: LookUp;

  constructor(
    private readonly storage: Storage,
    private readonly accessLimiter: AccessLimiter,
    lookup?: LookUp
  ) {
    if (lookup === undefined) {
      this.lookup = this;
    } else {
      this.lookup = lookup;
    }
  }

  async get<T>(id: ServiceIdentifier<T>): Promise<T | undefined> {
    const binding = this.storage.get(id, this.accessLimiter);
    if (binding === undefined) {
      return undefined;
    }

    return binding.resolve(this.lookup);
  }
}

export default AccessLimitedLookUp;
