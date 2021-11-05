import { Container, Resolver } from "cheeket";

type ContainerContext = {
  containers: {
    global: Container;
    local: Container;
  };
} & Resolver;

export default ContainerContext;
