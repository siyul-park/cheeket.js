import { interfaces } from "cheeket";

interface ContainerContext extends interfaces.Resolver {
  containers: {
    root: interfaces.Container;
    context: interfaces.Container;
  };
}

export default ContainerContext;
