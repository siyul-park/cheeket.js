import Provider from "./provider";
import Container from "./container";

interface ContainerScopeProvider<T> extends Provider<T> {
  delete(container: Container): void;
}

export default ContainerScopeProvider;
