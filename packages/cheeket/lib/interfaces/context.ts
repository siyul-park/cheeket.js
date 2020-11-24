import { EventEmitter2 } from "eventemitter2";
import Resolver from "./resolver";
import Request from "./request";

interface Context extends Resolver {
  readonly id: symbol;

  readonly request: Request<unknown>;

  readonly container: EventEmitter2;

  readonly parent?: Context;
  readonly children: Set<Context>;
}

export default Context;
