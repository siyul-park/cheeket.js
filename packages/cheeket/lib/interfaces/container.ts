import Resolver from "./resolver";
import Binder from "./binder";
import EventEmitter from "./event-emitter";
import ContainerConstructorOptions from "./container-constructor-options";

interface Container extends Resolver, Binder, EventEmitter {
  createChildContainer(options?: ContainerConstructorOptions): Container;
  clear(): Promise<void>;
}

export default Container;
