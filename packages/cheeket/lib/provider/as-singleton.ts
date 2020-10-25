import Provider from "./provider";

function asSingleton<T>(provider: Provider<T>): Provider<T> {
  let cache: T | undefined;
  return async (lookUp) => {
    if (cache === undefined) {
      cache = await provider(lookUp);
    }

    return cache;
  };
}

export default asSingleton;
