import { interfaces } from "cheeket";

interface ContainerContext extends interfaces.Resolver {
  containers: {
    global: interfaces.Container;
    local: interfaces.Container;
  };
}

export default ContainerContext;
