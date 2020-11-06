import Resolver from "./resolver";
import Request from "./request";

interface Context extends Resolver {
  id: symbol;

  request: Request<unknown>;

  parent?: Context;
  children: Set<Context>;
}

export default Context;
