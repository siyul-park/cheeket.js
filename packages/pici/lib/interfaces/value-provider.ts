import LookUp from "./look-up";

type ValueProvider<T> = (lookUp: LookUp) => Promise<T>;

export default ValueProvider;
