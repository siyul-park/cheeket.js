import { Container, Register, Resolver } from 'cheeket';

type ContainerContext = {
  containers: {
    global: Container;
    local: Container;
  };
} & Resolver &
Register;

export default ContainerContext;
