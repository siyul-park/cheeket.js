import { interfaces } from "cheeket";

interface Initializer {
  initRootContainer(container: interfaces.Container): void;
  initContextContainer(container: interfaces.Container): void;
}

export default Initializer;
