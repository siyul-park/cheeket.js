import Resolver from "./resolver";
import Request from "./request";

interface Context extends Resolver {
  id: symbol;
  request: Request<unknown>;
}

export default Context;
