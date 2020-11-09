import EventToken from "./event-token";

interface EventProducer {
  emit(event: EventToken, ...values: any[]): boolean;
  emitAsync(event: EventToken, ...values: any[]): Promise<any[]>;
}

export default EventProducer;
