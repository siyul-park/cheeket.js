import ProviderStorage from "../provider-storage";
import Provider from "../provider";
import Token from "../token";

function proxy<T>(storage: ProviderStorage, token: Token<T>): Provider<T> {
  return async (context, next) => {
    const middleware = storage.get(token);
    await middleware?.(context, next);
  };
}

export default proxy;
