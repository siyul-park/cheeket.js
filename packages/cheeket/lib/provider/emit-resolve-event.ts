import { AsyncEventEmitter } from "../event-emitter";

async function emitResolveEvent<T>(
  eventEmitter: AsyncEventEmitter,
  value: T
): Promise<void> {
  eventEmitter.emit("resolve", value);
  await eventEmitter.emitAsync("resolve:async", value);
}

export default emitResolveEvent;
