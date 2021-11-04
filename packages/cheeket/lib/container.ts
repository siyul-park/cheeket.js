import Resolver from "./resolver";

interface Container extends Resolver {
  childContainer(): Container;
}

export default Container;
