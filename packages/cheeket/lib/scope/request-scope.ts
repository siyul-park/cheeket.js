import InternalTokens from '../internal-tokens';
import InternalEvents from '../internal-events';
import Factory from '../factory';

type RequestScope<T> = Factory<T>;

function requestScope<T>(factory: Factory<T>): RequestScope<T> {
  return async (context) => {
    const eventEmitter = await context.resolve(InternalTokens.AsyncEventEmitter);

    eventEmitter.emit(InternalEvents.PreCreate, context);
    await eventEmitter.emitAsync(InternalEvents.PreCreateAsync, context);

    const value = await factory(context);

    eventEmitter.emit(InternalEvents.PostCreate, context);
    await eventEmitter.emitAsync(InternalEvents.PostCreateAsync, context);

    return value;
  };
}

export { RequestScope };
export default requestScope;
