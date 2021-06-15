import * as Koa from "koa";
import * as Cheeket from "cheeket";

import Context from "./context";
import Token from "./token";

function dependency<
  RootState = Cheeket.DefaultState,
  ContextState = Cheeket.DefaultState
>(
  rootContainer?: Cheeket.Container<RootState>
): Koa.Middleware<Koa.DefaultState, Context<RootState, ContextState>> {
  const finalRootContainer = rootContainer ?? new Cheeket.RootContainer();
  return async (context, next) => {
    const contextContainer = finalRootContainer.createChildContainer<ContextState>();

    contextContainer.bind(
      Token.Context,
      Cheeket.toMiddleware<Koa.Context, ContextState>(() => context)
    );
    contextContainer.bind(
      Token.Application,
      Cheeket.toMiddleware(() => context.app)
    );
    contextContainer.bind(
      Token.Request,
      Cheeket.toMiddleware(() => context.request)
    );
    contextContainer.bind(
      Token.Response,
      Cheeket.toMiddleware(() => context.response)
    );
    contextContainer.bind(
      Token.Req,
      Cheeket.toMiddleware(() => context.req)
    );
    contextContainer.bind(
      Token.Res,
      Cheeket.toMiddleware(() => context.res)
    );
    contextContainer.bind(
      Token.OriginalUrl,
      Cheeket.toMiddleware(() => context.origin)
    );
    contextContainer.bind(
      Token.Cookies,
      Cheeket.toMiddleware(() => context.cookies)
    );
    contextContainer.bind(
      Token.Accepts,
      Cheeket.toMiddleware(() => context.accept)
    );
    contextContainer.bind(
      Token.Respond,
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
