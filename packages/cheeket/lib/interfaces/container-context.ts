import { EventEmitter2 } from "eventemitter2";
import BindingDictionary from "./binding-dictionary";

interface ContainerContext {
  bindingDictionary: BindingDictionary;
  eventEmitter: EventEmitter2;
}

export default ContainerContext;
