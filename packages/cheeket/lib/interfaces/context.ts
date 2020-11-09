import Resolver from "./resolver";
import Request from "./request";
import EventProducer from "./event-producer";

interface Context extends Resolver, EventProducer {
  id: symbol;

  request: Request<unknown>;

  parent?: Context;
  children: Set<Context>;
}

export default Context;
