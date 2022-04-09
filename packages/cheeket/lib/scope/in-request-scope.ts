import InternalTokens from '../internal-tokens';
import InternalEvents from '../internal-events';
import Factory from '../factory';
import Middleware from '../middleware';
import BindStrategy from '../bind-strategy';

type InRequestScope<T> = Middleware<T>;

function inRequestScope<T, U = T>(factory: Factory<T, U>, bindStrategy: BindStrategy<T, U>): InRequestScope<T> {
  return async (context, next) => {
    const eventEmitter = await context.resolve(InternalTokens.AsyncEventEmitter);

    eventEmitter.emit(InternalEvents.PreCreate, context);
    await eventEmitter.emitAsync(InternalEvents.PreCreateAsync, context);

    const value = await factory(context);
    await bindStrategy.bind(context, value);

    eventEmitter.emit(InternalEvents.PostCreate, context);
    await eventEmitter.emitAsync(InternalEvents.PostCreateAsync, context);

    await bindStrategy.runNext(context, next);
  };
}

export { InRequestScope };
export default inRequestScope;
