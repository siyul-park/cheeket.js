import { Container } from "cheeket";

interface Module {
  configureGlobal(container: Container): Promise<void> | void;
  configureLocal(container: Container): Promise<void> | void;
}

export default Module;
