import LookUp from "./look-up";
import Identifier from "../identifier/identifier";
import CantResolveError from "./cant-resolve-error";

class LookUpProjector implements LookUp {
  constructor(
    private readonly lookUp: LookUp,
    private readonly ids: Set<Identifier<unknown>>
  ) {}

  async resolve<T>(id: Identifier<T>): Promise<T> {
    const value = await this.get(id);
    if (value === undefined) {
      throw new CantResolveError(`${id.toString()} is cant resolved`);
    }

    return value;
  }

  async get<T>(id: Identifier<T>): Promise<T | undefined> {
    if (!this.ids.has(id)) {
      return undefined;
    }
    return this.lookUp.get(id);
  }
}

export default LookUpProjector;
