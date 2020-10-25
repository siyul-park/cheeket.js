import LookUp from "./look-up";
import Identifier from "../identifier/identifier";
import CantResolveError from "./cant-resolve-error";
import Storage from "../storage/storage";

class Finder implements LookUp {
  private readonly subLookUps = new Set<LookUp>();

  constructor(private readonly storage: Storage) {}

  import(lookup: LookUp): void {
    this.subLookUps.add(lookup);
  }

  async resolve<T, R>(id: Identifier<T>): Promise<T> {
    const value = await this.get(id);
    if (value === undefined) {
      throw new CantResolveError(`${id.toString()} is cant resolved`);
    }

    return value;
  }

  async get<T>(id: Identifier<T>): Promise<T | undefined> {
    const binding = this.storage.get(id);
    if (binding !== undefined) {
      const value = await binding.resolve(this);
      if (value !== undefined) {
        return value;
      }
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const subLookUp of this.subLookUps) {
      // eslint-disable-next-line no-await-in-loop
      const subValue = await subLookUp.get(id);
      if (subValue !== undefined) {
        return subValue;
      }
    }

    return undefined;
  }
}

export default Finder;
