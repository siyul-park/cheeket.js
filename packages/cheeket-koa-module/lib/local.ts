import { Container } from "cheeket";

import Module from "./module";
import InternalTokens from "./internal-tokens";

function local(module: Module): Module {
  return {
    configure(container: Container) {
      container.register(InternalTokens.LocalModules, async (context, next) => {
        if (context.response === undefined) {
          context.response = [];
        }
        context.response.push(module);
        await next();
      });
    },
  };
}

export default local;
