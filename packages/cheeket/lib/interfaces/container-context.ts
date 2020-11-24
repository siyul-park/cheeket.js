import BindingDictionary from "./binding-dictionary";
import EventEmitter from "./event-emitter";

interface ContainerContext {
  bindingDictionary: BindingDictionary;
  eventEmitter: EventEmitter;
}

export default ContainerContext;
