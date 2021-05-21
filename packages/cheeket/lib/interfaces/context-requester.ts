import EventEmitter from "./event-emitter";

interface ContextRequester extends EventEmitter {
  id: symbol;
}

export default ContextRequester;
