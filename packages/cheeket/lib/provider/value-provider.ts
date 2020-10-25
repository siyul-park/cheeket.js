import LookUp from "../look-up/look-up.interface";

type ValueProvider<T> = (lookUp: LookUp) => Promise<T> | T;

export default ValueProvider;
