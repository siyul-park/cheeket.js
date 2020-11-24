import Resolver from "./resolver";
import Binder from "./binder";
import EventEmitter from "./event-emitter";
import EventEmitterOptions from "./event-emitter-options";

interface Container extends Resolver, Binder, EventEmitter {
  createChildContainer(options?: EventEmitterOptions): Container;
  clear(): Promise<void>;
}

export default Container;
