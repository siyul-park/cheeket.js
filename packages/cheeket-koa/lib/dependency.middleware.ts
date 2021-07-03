import * as Koa from "koa";
import * as Cheeket from "cheeket";
import { adaptMiddleware, MiddlewareAdapter, Provider } from "cheeket";

import Context from "./context";
import Tokens from "./tokens";

function dependency<
  RootState = Cheeket.DefaultState,
  ContextState = Cheeket.DefaultState
>(
  rootContainer?: Cheeket.Container<RootState>
): Koa.Middleware<Koa.DefaultState, Context<RootState, ContextState>> {
  const finalRootContainer = rootContainer ?? new Cheeket.RootContainer();

  function createMiddlewareAdapter<T>(
    provider: Provider<T, ContextState>
  ): MiddlewareAdapter<T, ContextState> {
    return adaptMiddleware<T, ContextState>(provider);
  }

  return async (context, next) => {
    const contextContainer =
      finalRootContainer.createChildContainer<ContextState>();

    const contextProvider = createMiddlewareAdapter<Koa.Context>(() => context);
    const appProvider = createMiddlewareAdapter(() => context.app);
    const requestProvider = createMiddlewareAdapter(() => context.request);
    const responseProvider = createMiddlewareAdapter(() => context.response);
    const reqProvider = createMiddlewareAdapter(() => context.req);
    const resProvider = createMiddlewareAdapter(() => context.res);
    const originProvider = createMiddlewareAdapter(() => context.origin);
    const cookiesProvider = createMiddlewareAdapter(() => context.cookies);
    const acceptProvider = createMiddlewareAdapter(() => context.accept);
    const respondProvider = createMiddlewareAdapter(() => context.respond);

    contextContainer.bind(Tokens.Context, contextProvider.bind());
    contextContainer.bind(Tokens.Application, appProvider.bind());
    contextContainer.bind(Tokens.Request, requestProvider.bind());
    contextContainer.bind(Tokens.Response, responseProvider.bind());
    contextContainer.bind(Tokens.Req, reqProvider.bind());
    contextContainer.bind(Tokens.Res, resProvider.bind());
    contextContainer.bind(Tokens.OriginalUrl, originProvider.bind());
    contextContainer.bind(Tokens.Cookies, cookiesProvider.bind());
    contextContainer.bind(Tokens.Accepts, acceptProvider.bind());
    contextContainer.bind(Tokens.Respond, respondProvider.bind());

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
