import Factory from '../factory';
import Middleware from '../middleware';

function asObject<T>(factory: Factory<T>): Middleware<T> {
  return async (context) => {
    context.response = await factory(context);
  };
}

export default asObject;
