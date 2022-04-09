import Middleware from './middleware';
import NestedResolver from '../resolver/nested-resolver';

function chain(resolver: NestedResolver | undefined): Middleware<unknown> {
  return async (context, next) => {
    await next();

    if (context.response === undefined) {
      context.response = await resolver?.resolve(context.request, context);
    }
  };
}

export default chain;
