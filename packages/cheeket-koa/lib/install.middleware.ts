import * as Cheeket from "cheeket";
import * as Koa from "koa";
import Context from "./context";
import Module from "./module";

function install<
  RootState = Cheeket.DefaultState,
  ContextState = Cheeket.DefaultState
>(
  module: Module<RootState, ContextState>
): Koa.Middleware<Koa.DefaultState, Context<RootState, ContextState>> {
  const containers = new Set<Cheeket.Container<RootState>>();
  const handleClose = (container: Cheeket.Container<RootState>) => {
    containers.delete(container);
    container.removeListener("close", handleClose);
  };

  return async (context, next) => {
    const { root: rootContainer, context: contextContainer } =
      context.containers;

    if (!containers.has(rootContainer)) {
      containers.add(rootContainer);
      module.configureRoot(rootContainer);
      rootContainer.on("close", handleClose);
    }

    module.configureContext(contextContainer);

    await next();
  };
}

export default install;
