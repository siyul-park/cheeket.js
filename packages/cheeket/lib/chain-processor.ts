import Provider from "./provider";
import ResolveProcessor from "./resolve-processor";

function chainProcessor(
  processor: ResolveProcessor | undefined
): Provider<unknown> {
  return async (context, next) => {
    await next();

    if (context.response === undefined) {
      context.response = await processor?.resolve(context.request, context);
    }
  };
}

export default chainProcessor;
