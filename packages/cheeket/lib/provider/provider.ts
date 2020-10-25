import LookUp from "../look-up/look-up";

type Provider<T> = (lookUp: LookUp) => Promise<T> | T;

export default Provider;
