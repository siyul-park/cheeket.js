import EventEmitter from "events";

interface ContainerEventEmitter extends EventEmitter {
  readonly id: string;

  emitAsync(event: string | symbol, ...args: never[]): Promise<boolean>;
}

export default ContainerEventEmitter;
