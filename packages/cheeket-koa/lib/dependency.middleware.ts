import * as Koa from "koa";
import * as Cheeket from "cheeket";

import Context from "./context";
import Tokens from "./tokens";

function dependency<
  RootState = Cheeket.DefaultState,
  ContextState = Cheeket.DefaultState
>(
  rootContainer?: Cheeket.Container<RootState>
): Koa.Middleware<Koa.DefaultState, Context<RootState, ContextState>> {
  const finalRootContainer = rootContainer ?? new Cheeket.RootContainer();
  return async (context, next) => {
    const contextContainer =
      finalRootContainer.createChildContainer<ContextState>();

    contextContainer.bind(
      Tokens.Context,
      Cheeket.toMiddleware<Koa.Context, ContextState>(() => context)
    );
    contextContainer.bind(
      Tokens.Application,
      Cheeket.toMiddleware(() => context.app)
    );
    contextContainer.bind(
      Tokens.Request,
      Cheeket.toMiddleware(() => context.request)
    );
    contextContainer.bind(
      Tokens.Response,
      Cheeket.toMiddleware(() => context.response)
    );
    contextContainer.bind(
      Tokens.Req,
      Cheeket.toMiddleware(() => context.req)
    );
    contextContainer.bind(
      Tokens.Res,
      Cheeket.toMiddleware(() => context.res)
    );
    contextContainer.bind(
      Tokens.OriginalUrl,
      Cheeket.toMiddleware(() => context.origin)
    );
    contextContainer.bind(
      Tokens.Cookies,
      Cheeket.toMiddleware(() => context.cookies)
    );
    contextContainer.bind(
      Tokens.Accepts,
      Cheeket.toMiddleware(() => context.accept)
    );
    contextContainer.bind(
      Tokens.Respond,
      Cheeket.toMiddleware(() => context.respond)
    );

    context.containers = {
      root: finalRootContainer,
      context: contextContainer,
    };

    context.resolve = (token) => contextContainer.resolve(token);

    try {
      await next();
    } finally {
      contextContainer.close();
    }
  };
}

export default dependency;
