import { AsyncEventEmitter } from "../event-emitter";

interface ContainerEventEmitter extends AsyncEventEmitter {
  readonly id: string;
}

export default ContainerEventEmitter;
