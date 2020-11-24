import Resolver from "./resolver";
import Request from "./request";
import EventEmitter from "./event-emitter";

interface Context extends Resolver {
  readonly id: symbol;

  readonly request: Request<unknown>;

  readonly container: EventEmitter;

  readonly parent?: Context;
  readonly children: Set<Context>;
}

export default Context;
