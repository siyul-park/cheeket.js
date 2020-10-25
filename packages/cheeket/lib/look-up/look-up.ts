import Identifier from "../identifier/identifier";

interface LookUp {
  get<T>(id: Identifier<T>): Promise<T | undefined>;
  fetch<T>(id: Identifier<T>): Promise<T>;
}

export default LookUp;
