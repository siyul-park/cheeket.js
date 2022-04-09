import Factory from '../factory';
import Middleware from '../middleware';

function asArray<T>(factory: Factory<T>): Middleware<T[]> {
  return async (context, next) => {
    const response = await factory(context);

    if (context.response === undefined) {
      context.response = [];
    }
    context.response.push(response);

    await next();
  };
}

export default asArray;
