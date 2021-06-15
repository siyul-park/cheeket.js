import EventEmitter from "events";

interface ContainerEventEmitter extends EventEmitter {
  readonly id: string;
}

export default ContainerEventEmitter;
