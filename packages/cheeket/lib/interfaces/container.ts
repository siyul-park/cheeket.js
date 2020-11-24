import { EventEmitter2 } from "eventemitter2";
import Resolver from "./resolver";
import Binder from "./binder";

interface Container extends Resolver, Binder, EventEmitter2 {
  createChildContainer(): Container;
}

export default Container;
