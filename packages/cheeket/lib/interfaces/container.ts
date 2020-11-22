import { EventEmitter2 } from "eventemitter2";
import Resolver from "./resolver";
import Binder from "./binder";
import EventProducer from "./event-producer";

interface Container extends Resolver, Binder, EventEmitter2, EventProducer {
  createChildContainer(): Container;
}

export default Container;
