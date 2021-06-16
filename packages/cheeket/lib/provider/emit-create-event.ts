import { AsyncEventEmitter } from "../event-emitter";

async function emitCreateEvent<T>(
  eventEmitter: AsyncEventEmitter,
  value: T
): Promise<void> {
  eventEmitter.emit("create", value);
  await eventEmitter.emitAsync("create:async", value);
}

export default emitCreateEvent;
