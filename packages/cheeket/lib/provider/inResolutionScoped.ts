import interfaces from "../interfaces/interfaces";

function inResolutionScoped<T>(
  provider: interfaces.Provider<T>
): interfaces.Provider<T> {
  const cache = new Map<symbol, T>();
  return async (context: interfaces.Context) => {
    const value = cache.get(context.id);
    if (value !== undefined) {
      return value;
    }

    const newOne = await provider(context);
    cache.set(context.id, newOne);
    return newOne;
  };
}

export default inResolutionScoped;
