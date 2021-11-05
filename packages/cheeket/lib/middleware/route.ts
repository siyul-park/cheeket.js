import Provider from "../provider";
import ProviderStorage from "../provider-storage";

function route(storage: ProviderStorage): Provider<unknown> {
  return async (context, next) => {
    await next();

    const provider = storage.get(context.request);
    if (context.response === undefined) {
      await provider?.(context, async () => {});
    }
  };
}

export default route;
