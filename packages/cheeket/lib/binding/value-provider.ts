import LookUp from "../look-up/look-up";

type ValueProvider<T> = (lookUp: LookUp) => Promise<T> | T;

export default ValueProvider;
