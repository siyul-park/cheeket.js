import ValueProvider from "./value-provider";

function asSingleton<T>(provider: ValueProvider<T>): ValueProvider<T> {
  let cache: T | undefined = undefined
  return async (lookUp) => {
    if (cache === undefined) {
      cache = await provider(lookUp);
    }

    return cache;
  }
}

export default asSingleton;
