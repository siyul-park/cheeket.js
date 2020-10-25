import Identifier from "../identifier/identifier";

interface LookUp {
  resolve<T>(id: Identifier<T>): Promise<T | undefined>;
  resolveOrThrow<T>(id: Identifier<T>): Promise<T>;
}

export default LookUp;
