import InternalTokens from '../internal-tokens';
import InternalEvents from '../internal-events';
import Factory from '../factory';

type RequestScope<T> = Factory<T>;

function requestScope<T>(factory: Factory<T>): RequestScope<T> {
  return async (context) => {
    const eventEmitter = await context.resolve(InternalTokens.AsyncEventEmitter);

    await eventEmitter.emit(InternalEvents.PreCreate, context);
    const value = await factory(context);
    await eventEmitter.emit(InternalEvents.PostCreate, context);

    return value;
  };
}

export { RequestScope };
export default requestScope;
