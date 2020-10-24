import ServiceIdentifier from "./service-identifier";

interface LookUp {
  get<T>(id: ServiceIdentifier<T>): Promise<T | undefined>;
  fetch<T>(id: ServiceIdentifier<T>): Promise<T>;
}

export default LookUp;
