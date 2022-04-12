import MiddlewareStorage from './middleware-storage';
import Middleware from './middleware';
import Token from '../token';

function proxy<T>(storage: MiddlewareStorage, token: Token<T>): Middleware<T> {
  return async (context, next) => {
    const middleware = storage.get(token);
    await middleware?.(context, next);
  };
}

export default proxy;
