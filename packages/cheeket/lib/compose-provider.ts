import Provider from "./provider";
import Context from "./context";
import Next from "./next";

function composeProvider<T>(
  providers: (Provider<T> | undefined | null)[],
  filter: (context: Context<T>) => boolean = () => true
): Provider<T> | undefined {
  const existedProviders = providers.filter(
    (provider) => provider != null
  ) as Provider<T>[];

  if (existedProviders.length === 0) {
    return undefined;
  }

  return existedProviders.reverse().reduce((pre, cur) => {
    return async (context: Context<T>, next: Next) => {
      await cur(context, async () => {
        if (filter(context)) {
          await pre(context, next);
        }
      });
    };
  });
}

export default composeProvider;
