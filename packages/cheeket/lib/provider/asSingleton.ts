import interfaces from "../interfaces/interfaces";

function asSingleton<T>(
  provider: interfaces.Provider<T>
): interfaces.Provider<T> {
  let cache: T | undefined;
  return async (context: interfaces.Context) => {
    if (cache === undefined) {
      cache = await provider(context);
    }

    return cache;
  };
}

export default asSingleton;
