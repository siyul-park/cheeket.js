import Middleware from './middleware';
import ResolveProcessor from '../resolve-processor';

function chain(processor: ResolveProcessor | undefined): Middleware<unknown> {
  return async (context, next) => {
    await next();

    if (context.response === undefined) {
      context.response = await processor?.resolve(context.request, context);
    }
  };
}

export default chain;
