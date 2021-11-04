import Resolver from "./resolver";
import Register from "./register";

interface Container extends Resolver, Register {
  childContainer(): Container;
}

export default Container;
