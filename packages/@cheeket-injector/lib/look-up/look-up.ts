import Identifier from "../identifier/identifier";

interface LookUp {
  resolve<T>(id: Identifier<T>): Promise<T>;
  get<T>(id: Identifier<T>): Promise<T | undefined>;
}

export default LookUp;
