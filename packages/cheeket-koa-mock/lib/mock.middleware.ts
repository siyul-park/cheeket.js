import * as Cheeket from "cheeket";
import * as CheeketKoa from "@cheeket/koa";
import * as Koa from "koa";

import MockInjector from "./mock-injector";
import MockModule from "./mock-module";

function mock<
  RootState = Cheeket.DefaultState,
  ContextState = Cheeket.DefaultState
>(
  module: MockModule<RootState, ContextState>
): Koa.Middleware<
  Koa.DefaultState,
  CheeketKoa.Context<RootState, ContextState>
> {
  const containers = new Set<Cheeket.Container<RootState>>();
  const handleClose = (container: Cheeket.Container<RootState>) => {
    containers.delete(container);
  };

  return async (context, next) => {
    const { root: rootContainer, context: contextContainer } =
      context.containers;

    if (!containers.has(rootContainer)) {
      const rootMockInjector = new MockInjector<RootState>();
      module.configureRoot(rootMockInjector);
      const rootInterceptor = rootMockInjector.compact();

      containers.add(rootContainer);
      rootContainer.use(
        rootInterceptor as Cheeket.Middleware<unknown, unknown>
      );
      rootContainer.on("close", handleClose);
    }

    const contextMockInjector = new MockInjector<ContextState>();
    module.configureContext(contextMockInjector);
    const contextInterceptor = contextMockInjector.compact();

    contextContainer.use(
      contextInterceptor as Cheeket.Middleware<unknown, unknown>
    );

    await next();
  };
}

export default mock;
