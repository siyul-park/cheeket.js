import BindingDictionary from "./binding-dictionary";
import ContextRequester from "./context-requester";

interface ContainerContext {
  bindingDictionary: BindingDictionary;
  contextRequester: ContextRequester;
}

export default ContainerContext;
