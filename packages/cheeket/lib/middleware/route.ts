import Provider from "../provider";
import ProviderStorage from "../provider-storage";

function route(storage: ProviderStorage): Provider<unknown> {
  return async (context, next) => {
    await next();

    if (context.response === undefined) {
      const provider = storage.get(context.request);
      await provider?.(context, async () => {});
    }
  };
}

export default route;
