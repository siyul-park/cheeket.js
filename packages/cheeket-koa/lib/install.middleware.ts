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
  };

  return async (context, next) => {
    if (!containers.has(context.containers.root)) {
      containers.add(context.containers.root);
      module.configureRoot(context.containers.root);
      context.containers.root.on("close", handleClose);
    }

    module.configureContext(context.containers.context);

    await next();
  };
}

export default install;
