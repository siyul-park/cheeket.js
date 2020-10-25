import Identifier from "../identifier/identifier";
import Binding from "../binding/binding";

interface StorageReader {
  get<T>(id: Identifier<T>): Binding<T> | undefined;
}

export default StorageReader;
