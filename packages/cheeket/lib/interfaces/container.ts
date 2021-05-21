import Resolver from "./resolver";
import Binder from "./binder";
import ContainerConstructorOptions from "./container-constructor-options";
import ContextRequester from "./context-requester";

interface Container extends Resolver, Binder, ContextRequester {
  createChildContainer(options?: ContainerConstructorOptions): Container;
  clear(): Promise<void>;
}

export default Container;
