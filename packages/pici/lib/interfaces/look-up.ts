import ServiceIdentifier from "./service-identifier";

interface LookUp {
  get<T>(id: ServiceIdentifier<T>): Promise<T | undefined>;
}

export default LookUp;
