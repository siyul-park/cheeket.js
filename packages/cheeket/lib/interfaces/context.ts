import Resolver from "./resolver";
import Request from "./request";
import ContextRequester from "./context-requester";

interface Context extends Resolver {
  readonly id: symbol;

  readonly request: Request<unknown>;

  readonly container: ContextRequester;

  readonly parent?: Context;
  readonly children: Set<Context>;
}

export default Context;
