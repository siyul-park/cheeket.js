import Newable from "./newable";
import Abstract from "./abstract";

type ServiceIdentifier<T> = string | symbol | Newable<T> | Abstract<T>;

export default ServiceIdentifier;
