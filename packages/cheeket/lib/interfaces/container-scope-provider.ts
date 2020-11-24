import Provider from "./provider";
import Container from "./container";

interface ContainerScopeProvider<T> extends Provider<T> {
  size: number;
  delete(container: Container): void;
}

export default ContainerScopeProvider;
