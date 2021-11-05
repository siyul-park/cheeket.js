import { Container } from "cheeket";

interface Module {
  configureGlobal(container: Container): void;
  configureLocal(container: Container): void;
}

export default Module;
