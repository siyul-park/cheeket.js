import Resolver from "./resolver";
import Binder from "./binder";

interface Container extends Resolver, Binder {}

export default Container;
